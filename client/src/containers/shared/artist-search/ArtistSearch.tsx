import './ArtistSearch.scss';

import * as React from 'react';
import { apiAxios } from '../../../api/setup-axios';

import { TextField, InputAdornment } from '@material-ui/core';
import { Image, Transformation } from 'cloudinary-react';
import debounce from 'lodash.debounce';
import { ReactSVG } from 'react-svg';
import Search from '../../../images/icons/Icon_Search.svg';

class ArtistSearch extends React.Component {
  state = {
    query: '',
    results: [],
    showResults: false,
  };

  fetchResults = debounce(async () => {
    const {
      data: { pages: data },
    } = await apiAxios({
      method: 'get',
      url: `/artists/typeahead.json?query=${this.state.query.toLowerCase()}`,
    });

    this.setState({ results: data });
    console.log(data);
  }, 400);

  updateSearchQuery = (e) => {
    this.setState({ query: e.target.value });
    this.fetchResults();
  };

  emptySearch = () => {
    return this.state.query.length > 0 && this.state.results.length === 0;
  };

  render() {
    return (
      <div className="artist-search">
        <TextField
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          value={this.state.query}
          onChange={this.updateSearchQuery}
          className={this.emptySearch() && 'empty'}
          placeholder="Search for an artist"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ReactSVG className="icon icon_black" src={Search} />
              </InputAdornment>
            ),
          }}
        />
        <div className="results">
          {this.state.results.map((page) => (
            <div key={page.id} className="result">
              <a href={`/artist/${page.slug}`}>
                <Image
                  publicId={page.cloudinaryImage.public_id}
                  alt={page.name}
                  className="artist-image"
                >
                  <Transformation
                    fetchFormat="auto"
                    crop="fill"
                    width={30}
                    height={30}
                    responsive_placeholder="blank"
                  />
                </Image>

                <span className="name">{page.name}</span>
              </a>
            </div>
          ))}
          {this.emptySearch() && (
            <div className="result-empty">No Artists Found</div>
          )}
        </div>
      </div>
    );
  }
}

export { ArtistSearch };

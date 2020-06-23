import './ArtistSearch.scss';

import * as React from 'react';
import { apiAxios } from '../../../api/setup-axios';
import { TextField, InputAdornment } from '@material-ui/core';
import { Image, Transformation } from 'cloudinary-react';
import debounce from 'lodash.debounce';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FontAwesomeIcon icon={faSearch} />
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
                    width={60}
                    height={60}
                    responsive_placeholder="blank"
                  />
                </Image>

                <span className="name">{page.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export { ArtistSearch };

import * as React from 'react';
import { Button, Chip, Toolbar } from '@material-ui/core';
import { Check, Block } from '@material-ui/icons';
import Moment from 'react-moment';
import { XGrid, GridRowsProp, GridColDef, GridValueFormatterParams } from '@material-ui/x-grid';
import { ReactSVG } from 'react-svg';
import Download from '../../images/icons/Icon_Download.svg';

interface ArtistSupportersProps {
  userData: any;
  selectedArtist: any;
}

export const ArtistSupporters = ({ userData, selectedArtist }: ArtistSupportersProps) => {
  const { subscriptions: supporters, artistSlug } = selectedArtist;

  const rows: GridRowsProp = supporters?.map((supporter) => ({
    id: supporter.id,
    name: supporter.name,
    email: supporter.email,
    monthly: supporter.amount / 100,
    status: supporter.status,
    // all_time: 556,
    city: supporter.city,
    country: supporter.country,
    supporting_since: supporter.supporter_since,
  }));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      renderCell: (params: GridValueFormatterParams) => (
        <a href={`mailto:${params.value}`}>{params.value}</a>
      ),
    },
    {
      field: 'monthly',
      headerName: 'Monthly',
      width: 100,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params: GridValueFormatterParams) => (
        <Chip
          size="small"
          icon={params.value === 'active' ? <Check /> : <Block />}
          style={
            params.value === 'active'
              ? { backgroundColor: '#baddac' }
              : { backgroundColor: 'inherent' }
          }
          label={params.value}
        />
      ),
    },
    // {
    //   field: 'all_time',
    //   headerName: 'All Time',
    //   width: 150,
    //   valueFormatter: (params: GridValueFormatterParams) =>
    //     params.value.toLocaleString('en-US', {
    //       style: 'currency',
    //       currency: 'USD',
    //     }),
    // },
    { field: 'city', headerName: 'City', width: 200 },
    { field: 'country', headerName: 'Country', width: 100 },
    {
      field: 'supporting_since',
      headerName: 'Supporting Since',
      width: 200,
      type: 'date',
      renderCell: (params: any) => (
        <Moment format="MMM Do, YYYY">{params.value}</Moment>
      ),
    },
  ];

  return (
    userData &&
    rows && (
      <>
        <Toolbar>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              window.open(`/artist/${artistSlug}/subscribers_csv`, '_blank')
            }
            startIcon={<ReactSVG className="icon icon_black" src={Download} />}
          >
            Download CSV
          </Button>
        </Toolbar>
        <XGrid
          rows={rows}
          columns={columns}
          rowHeight={40}
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
        />
      </>
    )
  );
};

export default ArtistSupporters;

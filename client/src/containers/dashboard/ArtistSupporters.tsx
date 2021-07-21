import * as React from 'react';
import { Button, Chip, Toolbar } from '@material-ui/core';
import { Check, Block } from '@material-ui/icons';
import Moment from 'react-moment';
import { 
  XGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
  GridToolbarContainer,
  GridToolbarExport
} from '@material-ui/x-grid';

interface ArtistSupportersProps {
  userData: any;
  selectedArtist: any;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export const ArtistSupporters = ({ userData, selectedArtist }: ArtistSupportersProps) => {
  const { subscriptions: supporters, artistSlug } = selectedArtist;

  const rows: GridRowsProp = supporters?.map((supporter) => ({
    id: supporter.id,
    name: supporter.name,
    monthly: supporter.amount / 100,
    status: supporter.status,
    // all_time: 556,
    city: supporter.city,
    country: supporter.country,
    supporting_since: supporter.supporter_since,
  }));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, },
    {
      field: 'monthly',
      headerName: 'Monthly',
      width: 150,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
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
    { field: 'city', headerName: 'City', flex: 0.5 },
    { field: 'country', headerName: 'Country', flex: 0.5 },
    {
      field: 'supporting_since',
      headerName: 'Supporting Since',
      flex: 1,
      type: 'date',
      renderCell: (params: any) => (
        <Moment format="MMM Do, YYYY">{params.value}</Moment>
      ),
    },
  ];

  return (
    userData &&
    rows && (
      <XGrid
        rows={rows}
        columns={columns}
        rowHeight={40}
        rowsPerPageOptions={[25, 50, 100, 500, 1000]}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    )
  );
};

export default ArtistSupporters;

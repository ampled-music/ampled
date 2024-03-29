import * as React from 'react';
import { Chip } from '@material-ui/core';
import { Check, Block } from '@material-ui/icons';
import Moment from 'react-moment';
import { 
  XGrid,
  GridRowsProp,
  GridColDef,
  GridValueFormatterParams,
} from '@material-ui/x-grid';

interface ArtistSupportersProps {
  userData: any;
  selectedArtist: any;
}

export const ArtistSupporters = ({ userData, selectedArtist }: ArtistSupportersProps) => {
  const { subscriptions: supporters } = selectedArtist;

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
    { field: 'name', headerName: 'Name', width: 170 },
    {
      field: 'monthly',
      headerName: 'Monthly',
      width: 140,
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
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
    { field: 'city', headerName: 'City', width: 140 },
    { field: 'country', headerName: 'Country', width: 140},
    {
      field: 'supporting_since',
      headerName: 'Supporting Since',
      width: 250,
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
      <div style={{ height: '100vh', width: '100%' }}>
        <XGrid
          rows={rows}
          columns={columns}
          rowHeight={40}
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
          // components={{
          //   Toolbar: CustomToolbar,
          // }}
        />
      </div>
    )
  );
};

export default ArtistSupporters;

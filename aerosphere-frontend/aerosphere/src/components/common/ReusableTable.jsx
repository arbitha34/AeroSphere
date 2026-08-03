import { useMemo, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, TextField, InputAdornment, Stack, Button,
  Toolbar, Typography, Tooltip, IconButton,
} from '@mui/material';
import { FiSearch, FiDownload, FiPrinter, FiUpload, FiFilter } from 'react-icons/fi';
import EmptyState from './EmptyState';

function exportToCsv(filename, columns, rows) {
  const header = columns.map((c) => `"${c.headerName}"`).join(',');
  const body = rows
    .map((row) => columns.map((c) => `"${String(row[c.field] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReusableTable({
  columns,
  rows,
  title,
  searchable = true,
  searchKeys,
  onRowClick,
  onFilterClick,
  onImport,
  getRowId = (r) => r.id,
  defaultRowsPerPage = 10,
  dense = false,
}) {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(columns[0]?.field);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const keys = searchKeys || columns.map((c) => c.field);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)));
  }, [rows, search, keys]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return order === 'asc' ? av - bv : bv - av;
      return order === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [filtered, order, orderBy]);

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (field) => {
    if (orderBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setOrderBy(field); setOrder('asc'); }
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1.5, py: 2 }}>
        {title && <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>{title}</Typography>}
        {searchable && (
          <TextField
            size="small"
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 220, ml: title ? 0 : 'auto' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><FiSearch /></InputAdornment> }}
          />
        )}
        <Stack direction="row" spacing={1}>
          {onFilterClick && (
            <Tooltip title="Advanced filters">
              <Button size="small" variant="outlined" startIcon={<FiFilter />} onClick={onFilterClick}>Filters</Button>
            </Tooltip>
          )}
          {onImport && (
            <Tooltip title="Import data">
              <IconButton size="small" onClick={onImport}><FiUpload /></IconButton>
            </Tooltip>
          )}
          <Tooltip title="Export CSV">
            <IconButton size="small" onClick={() => exportToCsv(`${title || 'export'}.csv`, columns, sorted)}>
              <FiDownload />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton size="small" onClick={() => window.print()}><FiPrinter /></IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>

      <TableContainer sx={{ maxHeight: 560 }}>
        <Table stickyHeader size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {col.sortable === false ? col.headerName : (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.render ? col.render(row) : row[col.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sorted.length === 0 && <EmptyState title="No results" description="Nothing matches your search or filters." />}

      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}

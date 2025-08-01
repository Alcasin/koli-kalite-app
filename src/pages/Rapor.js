import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import trLocale from "date-fns/locale/tr";
import { trTR } from "@mui/x-data-grid/locales";
import { isValid } from "date-fns";
import { format } from "date-fns/format";
import { BASE_URL } from "../config/apiConfig"; // ✅ BASE_URL importu

const columns = [
  { field: "koliNo", headerName: "Koli Numarası", width: 180 },
  { field: "adet", headerName: "Adet", width: 100 },
  { field: "model", headerName: "Model", width: 200 },
  { field: "barkod", headerName: "Barkod", width: 200 },
  {
    field: "creationDate",
    headerName: "Oluşturulma Tarihi",
    width: 200,
    type: "date",
    valueFormatter: (value) => {
      if (value && isValid(new Date(value))) {
        return format(new Date(value), "dd-MM-yyyy HH:mm");
      }
      return "";
    },
  },
];

export default function Rapor({ showSnackbar }) {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === "startDate") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/ListAllBox`)
      .then((res) => res.json())
      .then((data) => {
        if (data.responseCode === 0 && Array.isArray(data.entityDataList)) {
          const fmt = data.entityDataList.map((it) => ({
            id: it.id,
            koliNo: it.kolI_NO,
            adet: +it.adet,
            model: it.sku,
            barkod: it.barkod,
            creationDate: it.creatioN_DATE,
          }));
          setRows(fmt);
          setFilteredRows(fmt);
        } else {
          showSnackbar("Veri alınamadı", "error");
        }
      })
      .catch((err) => console.error("API hatası:", err));
  }, [showSnackbar]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      showSnackbar("Lütfen iki tarihi de seçin", "warning");
      return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = rows.filter((r) => {
      const created = new Date(r.creationDate);
      return created >= start && created <= end;
    });

    setFilteredRows(filtered);
  };

  return (
    <Box display="flex" flexDirection="column" height="85vh" px={4} pt={2}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={trLocale}
      >
        <Grid container mb={3}>
          <Grid
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Grid size={isMobile ? 12 : 4}>
              <TextField
                type="datetime-local"
                margin="dense"
                variant="outlined"
                name="startDate"
                label="Başlangıç tarihi"
                value={startDate}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={{ width: isMobile ? "100%" : "90%" }}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 4} mb={isMobile ? 2 : 0}>
              <TextField
                type="datetime-local"
                margin="dense"
                variant="outlined"
                name="endDate"
                label="Bitiş tarihi"
                value={endDate}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={{ width: isMobile ? "100%" : "90%" }}
              />
            </Grid>
            <Grid size={isMobile ? 12 : 2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ height: "56px" }}
                onClick={handleFilter}
              >
                FİLTRELE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Box sx={{ flex: 1, mb: 2 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>

      <Box display="flex" justifyContent="center" pb={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<ExitToAppIcon />}
          sx={{ width: isMobile ? "100%" : "200px" }}
          onClick={() => {
            showSnackbar("Çıkış yapılacak", "info");
          }}
        >
          ÇIKIŞ
        </Button>
      </Box>
    </Box>
  );
}

// src/pages/KoliIcerikSilme.js
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import { BASE_URL } from "../config/apiConfig"; // ✅ BASE_URL import

const columns = [
  { field: "sku", headerName: "SKU", width: 300 },
  { field: "adet", headerName: "Adet", width: 200 },
];

export default function KoliIcerikSilme({ showSnackbar }) {
  const [silKoliNo, setSilKoliNo] = useState("");
  const [silBarkod, setSilBarkod] = useState("");
  const [silRows, setSilRows] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSilKoliNoKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    if (!silKoliNo.trim()) {
      showSnackbar("Koli numarası boş olamaz.", "warning");
      setSilRows([]);
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/ListByBoxNumber?koliNo=${silKoliNo}`,
        { method: "POST", headers: { Accept: "application/json" } }
      );
      const data = await res.json();

      if (
        data.responseCode !== 0 ||
        !Array.isArray(data.entityDataList) ||
        data.entityDataList.length === 0
      ) {
        showSnackbar("Koli bulunamadı.", "error");
        setSilRows([]);
        return;
      }

      const formatted = data.entityDataList.map((item, i) => ({
        id: i + 1,
        sku: item.sku,
        adet: parseInt(item.adet, 10),
        barkod: item.barkod,
      }));
      setSilRows(formatted);
    } catch (err) {
      console.error(err);
      showSnackbar("Silme koli içeriği alma hatası", "error");
    }
  };

  const handleSilBarkodKeyDown = async (e) => {
    if (e.key !== "Enter") return;

    if (!silBarkod.trim()) {
      showSnackbar("Barkod boş olamaz.", "warning");
      return;
    }

    const exists = silRows.some((r) => r.barkod === silBarkod);
    if (!exists) {
      showSnackbar("Ürün bu koli içinde bulunamadı.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/DeleteBox?koliNo=${silKoliNo}&barkod=${silBarkod}`,
        { method: "DELETE", headers: { Accept: "application/json" } }
      );
      const data = await res.json();

      if (data.responseCode !== 0) {
        showSnackbar(data.responseMessage || "Silme başarısız.", "error");
        return;
      }

      showSnackbar(
        data.responseMessage || "Ürün başarıyla silindi.",
        "success"
      );

      await handleSilKoliNoKeyDown({ key: "Enter" }); // tabloyu güncelle
      setSilBarkod(""); // barkodu temizle
    } catch (err) {
      console.error(err);
      showSnackbar("Silme API hatası", "error");
    }
  };

  const handleSilBarkodTemizle = () => {
    setSilKoliNo("");
    setSilBarkod("");
    setSilRows([]);
  };

  return (
    <Box px={4} pt={2}>
      {/* Giriş Alanları */}
      <Box
        display="flex"
        gap={2}
        sx={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <TextField
          label="Koli Numarası"
          fullWidth
          value={silKoliNo}
          onChange={(e) => setSilKoliNo(e.target.value)}
          onKeyDown={handleSilKoliNoKeyDown}
          placeholder="Enter ile listele"
        />
        <TextField
          label="Ürün Barkod"
          fullWidth
          value={silBarkod}
          onChange={(e) => setSilBarkod(e.target.value)}
          onKeyDown={handleSilBarkodKeyDown}
          placeholder="Enter ile sil"
        />
      </Box>

      {/* Tablo */}
      <Box sx={{ height: 360, my: 2 }}>
        <DataGrid
          rows={silRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          localeText={{ noRowsLabel: "Satır yok" }}
        />
      </Box>

      {/* Toplam Adet */}
      <Typography>
        Toplam Adet: {silRows.reduce((sum, r) => sum + r.adet, 0)}
      </Typography>

      {/* Temizle Butonu */}
      <Box display="flex" mt={2} mb={2}>
        <Button
          fullWidth
          startIcon={<CancelIcon />}
          variant="contained"
          color="warning"
          onClick={handleSilBarkodTemizle}
        >
          Temizle
        </Button>
      </Box>
    </Box>
  );
}

// src/pages/KoliIcerikOkutma.js
import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { BASE_URL } from "../config/apiConfig"; // ✅ BASE_URL kullanımı

const columns = [
  { field: "sku", headerName: "SKU", width: 300 },
  { field: "adet", headerName: "Adet", width: 200 },
];

export default function KoliIcerikOkutma({ showSnackbar }) {
  const [koliNo, setKoliNo] = useState("");
  const [koliNoTouched, setKoliNoTouched] = useState(false);
  const [barkod, setBarkod] = useState("");
  const [barkodTouched, setBarkodTouched] = useState(false);
  const [rows, setRows] = useState([]);
  const [toplamAdet, setToplamAdet] = useState(0);
  const barkodRef = useRef(null);

  const isKoliNoInvalid = koliNo.trim() === "" && koliNoTouched;
  const isBarkodInvalid = barkod.trim() === "" && barkodTouched;
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleKoliNoKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    if (!koliNo.trim()) {
      setKoliNoTouched(true);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/KoliKontrol?koliNo=${koliNo}`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!data || typeof data.entityData === "undefined") {
        showSnackbar("Sunucudan geçersiz yanıt geldi", "error");
        return;
      }
      if (data.entityData === false) {
        showSnackbar(
          data.responseMessage || "Bu koli numarası zaten kayıtlı.",
          "error"
        );
        return;
      }
      showSnackbar(
        "Yeni koli numarası kabul edildi. Barkodu okutun.",
        "success"
      );
      barkodRef.current?.focus();
    } catch (err) {
      console.error(err);
      showSnackbar("KoliKontrol API hatası", "error");
    }
  };

  const handleBarkodKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    if (!barkod.trim()) {
      setBarkodTouched(true);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/UrunBul?barkod=${barkod}`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!data || typeof data.entityData === "undefined") {
        showSnackbar("Sunucudan geçersiz yanıt geldi", "error");
        return;
      }
      if (!data.entityData) {
        showSnackbar(data.responseMessage || "Ürün bulunamadı.", "error");
        return;
      }
      const { sku, adet, inventorY_ITEM_ID } = data.entityData;
      const idx = rows.findIndex((r) => r.sku === sku);
      let updated;
      if (idx > -1) {
        updated = rows.map((r, i) =>
          i === idx ? { ...r, adet: r.adet + parseInt(adet, 10) } : r
        );
      } else {
        updated = [
          ...rows,
          {
            id: rows.length + 1,
            sku,
            adet: parseInt(adet, 10),
            item_ID: inventorY_ITEM_ID,
          },
        ];
      }
      setRows(updated);
      setToplamAdet((prev) => prev + parseInt(adet, 10));
      setBarkod("");
      setBarkodTouched(false);
    } catch (err) {
      console.error(err);
      showSnackbar("UrunBul API hatası", "error");
    }
  };

  const handleSave = async () => {
    if (!rows.length) {
      showSnackbar("Önce ürün ekleyin.", "warning");
      return;
    }
    const payload = rows.map((r) => ({
      id: 0,
      koli_NO: koliNo,
      adet: r.adet,
      item_ID: r.item_ID,
      created_BY: 0,
      creation_DATE: new Date().toISOString(),
    }));
    try {
      const res = await fetch(`${BASE_URL}/KoliIcerikKayit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.responseCode === 0) {
        showSnackbar(data.responseMessage || "Kayıt başarılı", "success");
        handleClear();
      } else {
        showSnackbar(data.responseMessage || "Kayıt hatası", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("KoliIcerikKayit API hatası", "error");
    }
  };

  const handleClear = () => {
    setKoliNo("");
    setBarkod("");
    setRows([]);
    setToplamAdet(0);
    setKoliNoTouched(false);
    setBarkodTouched(false);
  };

  return (
    <Box px={4} pt={2}>
      <Box
        display="flex"
        gap={2}
        sx={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <TextField
          label="Koli Numarası"
          fullWidth
          value={koliNo}
          onChange={(e) => setKoliNo(e.target.value)}
          onBlur={() => setKoliNoTouched(true)}
          onKeyDown={handleKoliNoKeyDown}
          error={isKoliNoInvalid}
          helperText={isKoliNoInvalid && "Boş olamaz"}
        />
        <TextField
          label="Ürün Barkod"
          fullWidth
          inputRef={barkodRef}
          value={barkod}
          onChange={(e) => setBarkod(e.target.value)}
          onBlur={() => setBarkodTouched(true)}
          onKeyDown={handleBarkodKeyDown}
          error={isBarkodInvalid && rows.length === 0}
          helperText={isBarkodInvalid && rows.length === 0 && "Boş olamaz"}
        />
      </Box>
      <Box sx={{ height: 360, my: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <Typography>Toplam Adet: {toplamAdet}</Typography>
      <Box
        display="flex"
        gap={2}
        mt={2}
        sx={{ flexDirection: isMobile ? "column" : "row", mb: 2 }}
      >
        <Button
          sx={{ flex: 1 }}
          startIcon={<SaveIcon />}
          variant="contained"
          color="secondary"
          onClick={handleSave}
        >
          Kaydet
        </Button>
        <Button
          sx={{ flex: 1 }}
          startIcon={<CancelIcon />}
          variant="contained"
          color="warning"
          onClick={handleClear}
        >
          Temizle
        </Button>
        <Button
          sx={{ flex: 1 }}
          startIcon={<ExitToAppIcon />}
          variant="contained"
          color="error"
        >
          Çıkış
        </Button>
      </Box>
    </Box>
  );
}

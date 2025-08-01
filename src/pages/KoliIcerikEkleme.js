// src/pages/KoliIcerikEkleme.js
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
import { BASE_URL } from "../config/apiConfig"; // ✅ GLOBAL BASE_URL

const columns = [
  { field: "sku", headerName: "SKU", width: 300 },
  { field: "adet", headerName: "Adet", width: 200 },
];

export default function KoliIcerikEkleme({ showSnackbar }) {
  const [koliNo, setKoliNo] = useState("");
  const [koliNoTouched, setKoliNoTouched] = useState(false);
  const [barkod, setBarkod] = useState("");
  const [barkodTouched, setBarkodTouched] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const [rows, setRows] = useState([]);
  const [toplamAdet, setToplamAdet] = useState(0);

  const barkodRef = useRef(null);
  const initialRowsRef = useRef([]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const resetAfterSave = () => {
    setRows([]);
    setToplamAdet(0);
    setBarkod("");
    setBarkodTouched(false);
    setHasAdded(false);
    barkodRef.current?.focus();
  };

  const handleClear = () => {
    setKoliNo("");
    setKoliNoTouched(false);
    resetAfterSave();
  };

  const handleKoliNoKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    if (!koliNo.trim()) {
      setKoliNoTouched(true);
      return;
    }
    setHasAdded(false);
    try {
      const kontrol = await fetch(`${BASE_URL}/KoliKontrol?koliNo=${koliNo}`, {
        method: "POST",
        headers: { Accept: "application/json" },
      }).then((r) => r.json());
      if (!kontrol || kontrol.entityData === true) {
        showSnackbar(kontrol?.responseMessage || "Koli bulunamadı.", "error");
        resetAfterSave();
        return;
      }

      const listData = await fetch(
        `${BASE_URL}/ListByBoxNumber?koliNo=${koliNo}`,
        { method: "POST", headers: { Accept: "application/json" } }
      ).then((r) => r.json());

      if (
        listData.responseCode === 0 &&
        Array.isArray(listData.entityDataList)
      ) {
        const fmt = listData.entityDataList.map((itm) => ({
          id: itm.id,
          sku: itm.sku,
          adet: +itm.adet,
          iteM_ID: itm.iteM_ID ?? 0,
          createD_BY: itm.createD_BY ?? 0,
          creatioN_DATE: itm.creation_DATE ?? new Date().toISOString(),
        }));
        setRows(fmt);
        setToplamAdet(fmt.reduce((sum, r) => sum + r.adet, 0));
        initialRowsRef.current = fmt;
      } else {
        showSnackbar("Koli içeriği yüklenemedi.", "warning");
        resetAfterSave();
      }

      barkodRef.current?.focus();
    } catch (err) {
      console.error(err);
      showSnackbar("Koli kontrol hatası", "error");
      resetAfterSave();
    }
  };

  const handleBarkodKeyDown = async (e) => {
    if (e.key !== "Enter") return;
    if (!barkod.trim() && !hasAdded) {
      setBarkodTouched(true);
      return;
    }
    try {
      const data = await fetch(`${BASE_URL}/UrunBul?barkod=${barkod}`, {
        method: "POST",
        headers: { Accept: "application/json" },
      }).then((r) => r.json());
      if (!data?.entityData) {
        showSnackbar(data?.responseMessage || "Ürün bulunamadı.", "error");
        return;
      }

      const { sku, adet } = data.entityData;
      const iteM_ID =
        data.entityData.iteM_ID ?? data.entityData.inventorY_ITEM_ID ?? 0;

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
            id: 0,
            sku,
            adet: parseInt(adet, 10),
            iteM_ID,
            createD_BY: 0,
            creatioN_DATE: new Date().toISOString(),
          },
        ];
      }
      setRows(updated);
      setToplamAdet((t) => t + parseInt(adet, 10));
      setHasAdded(true);
      setBarkod("");
      setBarkodTouched(false);
    } catch (err) {
      console.error(err);
      showSnackbar("Ürün bulma hatası", "error");
    }
  };

  const handleSave = async () => {
    if (rows.length === 0) {
      showSnackbar("Önce ürün ekleyin.", "warning");
      return;
    }

    const combinedMap = new Map();
    initialRowsRef.current.forEach((r) => {
      combinedMap.set(r.sku, { ...r });
    });
    rows.forEach((r) => {
      const existing = combinedMap.get(r.sku);
      combinedMap.set(r.sku, {
        ...r,
        id: existing?.id ?? r.id ?? 0,
        iteM_ID: r.iteM_ID ?? existing?.iteM_ID ?? 0,
        createD_BY: r.createD_BY ?? existing?.createD_BY ?? 0,
        creatioN_DATE:
          r.creatioN_DATE ??
          existing?.creatioN_DATE ??
          new Date().toISOString(),
      });
    });

    const payload = Array.from(combinedMap.values()).map((r) => ({
      id: r.id,
      kolI_NO: koliNo,
      adet: r.adet,
      iteM_ID: r.iteM_ID,
      createD_BY: r.createD_BY,
      creatioN_DATE: r.creatioN_DATE,
    }));

    try {
      const data = await fetch(`${BASE_URL}/UpdateBox`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (data.responseCode === 0) {
        showSnackbar(data.responseMessage || "Güncellendi.", "success");
        handleClear();
      } else {
        showSnackbar(data.responseMessage || "Güncelleme hatası.", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Güncelleme hatası", "error");
    }
  };

  return (
    <Box px={4} pt={2}>
      {/* Giriş Alanları */}
      <Box
        display="flex"
        gap={2}
        sx={{ flexDirection: isMobile ? "column" : "row", mb: 2 }}
      >
        <TextField
          label="Koli Numarası"
          fullWidth
          value={koliNo}
          onChange={(e) => setKoliNo(e.target.value)}
          onBlur={() => setKoliNoTouched(true)}
          onKeyDown={handleKoliNoKeyDown}
          error={koliNoTouched && !koliNo.trim()}
          helperText={koliNoTouched && !koliNo.trim() && "Boş olamaz"}
        />
        <TextField
          label="Ürün Barkod"
          fullWidth
          inputRef={barkodRef}
          value={barkod}
          onChange={(e) => setBarkod(e.target.value)}
          onBlur={() => setBarkodTouched(true)}
          onKeyDown={handleBarkodKeyDown}
          error={barkodTouched && !barkod.trim() && !hasAdded}
          helperText={
            barkodTouched && !barkod.trim() && !hasAdded && "Boş olamaz"
          }
        />
      </Box>

      {/* Tablo */}
      <Box sx={{ height: 360, my: 2 }}>
        <DataGrid
          rows={rows.map((r, i) => ({ ...r, id: r.id || `new-${i}` }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          localeText={{ noRowsLabel: "Satır yok" }}
        />
      </Box>

      {/* Alt Panel */}
      <Typography>Toplam Adet: {toplamAdet}</Typography>
      <Box
        display="flex"
        gap={2}
        mt={2}
        sx={{ flexDirection: isMobile ? "column" : "row", mb: 2 }}
      >
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Kaydet
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="warning"
          startIcon={<CancelIcon />}
          onClick={handleClear}
        >
          Temizle
        </Button>
      </Box>
    </Box>
  );
}

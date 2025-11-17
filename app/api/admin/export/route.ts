// app/api/admin/export/route.ts
import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

type IncomingLog = Record<string, any>

const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

// ======= Template struktur=======
const TEMPLATE = [
  {
    feature: 'Informasi',
    rows: [
      { labelLeft: 'Cek Status Kepesertaan', labelRight: 'Cek Status Kepesertaan', subSub: 'Cek Status Kepesertaan' },
      { labelLeft: 'Cek Status Pembayaran', labelRight: 'Cek Status Pembayaran', subSub: 'Cek Status Pembayaran' },
      { labelLeft: 'Cek Virtual Account', labelRight: 'Cek Virtual Account', subSub: 'Cek Virtual Account' },
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },
      { isSummary: true, labelLeft: 'Total Akses Fitur' }
    ]
  },
  {
    feature: 'Pengaduan',
    rows: [
      { labelLeft: 'Pengaduan', labelRight: 'Pengaduan', subSub: 'Pengaduan' },
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },
      { isSummary: true, labelLeft: 'Total Akses Fitur' }
    ]
  },
  {
    feature: 'Administrasi',
    rows: [
      { labelLeft: 'Pendaftaran Baru', children: [
        { labelRight: 'PNS/TNI/POLRI', subSub: 'PNS/TNI/POLRI' },
        { labelRight: 'PBPU/Mandiri', subSub: 'PBPU/Mandiri' },
        { labelRight: 'Peserta Jaminan Kesehatan Aceh (JKA)', subSub: 'Peserta Jaminan Kesehatan Aceh (JKA)' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Penambahan Anggota Keluarga', children: [
        { labelRight: 'PNS/TNI/POLRI dan Pensiunan/Veteran-PK/PPK', subSub: 'PNS/TNI/POLRI dan Pensiunan/Veteran-PK/PPK' },
        { labelRight: 'PBI JAMINAN KESEHATAN (Bayi Baru Lahir)', subSub: 'PBI JAMINAN KESEHATAN (Bayi Baru Lahir)' },
        { labelRight: 'PBPU/Mandiri', subSub: 'PBPU/Mandiri' },
        { labelRight: 'Pegawai Swasta/BUMN/BUMD', subSub: 'Pegawai Swasta/BUMN/BUMD' },
        { labelRight: 'Penambahan Anggota Keluarga Jaminan Kesehatan Aceh (JKA)', subSub: 'Penambahan Anggota Keluarga Jaminan Kesehatan Aceh (JKA)' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Pengaktifan Kembali Status Kepesertaan', children: [
        { labelRight: 'Anak > 21 Tahun Masih Kuliah', subSub: 'Anak > 21 Tahun Masih Kuliah' },
        { labelRight: 'Registrasi Ulang (PNS/TNI/POLRI/PENSIUNAN/VETERAN-PERINTIS KEMERDEKAAN)', subSub: 'Registrasi Ulang (PNS/TNI/POLRI/PENSIUNAN/VETERAN-PERINTIS KEMERDEKAAN)' },
        { labelRight: 'Registrasi Ulang Bayi Berusia > 3 Bulan Melengkapi NIK', subSub: 'Registrasi Ulang Bayi Berusia > 3 Bulan Melengkapi NIK' },
        { labelRight: 'WNI Kembali dari Luar Negeri', subSub: 'WNI Kembali dari Luar Negeri' },
        { labelRight: 'Data Ganda', subSub: 'Data Ganda' },
        { labelRight: 'Reaktivasi PHK dengan Jaminan 6 Bulan', subSub: 'Reaktivasi PHK dengan Jaminan 6 Bulan' },
        { labelRight: 'Peserta PBI Jaminan Kesehatan non Aktif ke peserta JKA', subSub: 'Peserta PBI Jaminan Kesehatan non Aktif ke peserta JKA' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Perubahan/Perbaikan Data', children: [
        { labelRight: 'Perubahan identitas (NIK,NO KK, Nama, Tanggal lahir, JK, Alamat)', subSub: 'Perubahan identitas (NIK,NO KK, Nama, Tanggal lahir, JK, Alamat)' },
        { labelRight: 'Nomor Handphone', subSub: 'Nomor Handphone' },
        { labelRight: 'Golongan dan Gaji (PNS dan TNI/POLRI)', subSub: 'Golongan dan Gaji (PNS dan TNI/POLRI)' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Ubah Fasilitas Kesehatan Tingkat Pertama', children: [
        { labelRight: 'Peserta TNI/POLRI', subSub: 'Peserta TNI/POLRI' },
        { labelRight: 'Terdaftar Lebih Dari 3 Bulan', subSub: 'Terdaftar Lebih Dari 3 Bulan' },
        { labelRight: 'Terdaftar Kurang dari 3 Bulan (Pindah Domisili/ Pindah Tugas)', subSub: 'Terdaftar Kurang dari 3 Bulan (Pindah Domisili/ Pindah Tugas)' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Pengurangan Anggota Keluarga', children: [
        { labelRight: 'Pelaporan Peserta Meninggal Dunia', subSub: 'Pelaporan Peserta Meninggal Dunia' },
        { labelRight: 'Pembaharuan KK (KK Baru/Pisah KK)', subSub: 'Pembaharuan KK (KK Baru/Pisah KK)' },
        { labelRight: 'Pelaporan WNI Pergi Keluar Negeri', subSub: 'Pelaporan WNI Pergi Keluar Negeri' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Perubahan Kelas Rawat', children: [
        { labelRight: 'Perubahan Kelas Rawat', subSub: 'Perubahan Kelas Rawat' },
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { labelLeft: 'Pengaktifan Kembali Nomor Pembayaran Iuran Yang Telah Lewat Masa Bayar', children:[
        { labelRight: 'Pengaktifan Kembali Nomor Pembayaran Iuran Yang Telah Lewat Masa Bayar', subSub: 'Pengaktifan Kembali Nomor Pembayaran Iuran Yang Telah Lewat Masa Bayar' }
      ]},
      { isSummary: true, labelLeft: 'Jumlah Akses Subfitur' },

      { isSummary: true, labelLeft: 'Total Akses Fitur' }
    ]
  }
]
// =====================================================

function getSatuanKerjaName(item: IncomingLog) {
  return item.satuanKerja?.name ?? item.satuanKerja ?? item.satuanKerjaName ?? item.satuan_kerja ?? 'Unknown'
}

function getSubSubName(item: IncomingLog) {
  // coba beberapa kemungkinan field
  if (typeof item.subSubFeature === 'string') return item.subSubFeature
  if (item.subSubFeature && typeof item.subSubFeature.name === 'string') return item.subSubFeature.name
  if (typeof item.sub_sub_feature === 'string') return item.sub_sub_feature
  if (typeof item.subFeature === 'string' && item.feature && String(item.feature).toLowerCase().includes('administrasi')) {
    // fallback: sometimes subFeature used
    return item.subFeature
  }
  // fallback to feature field
  if (typeof item.feature === 'string') return item.feature
  return ''
}

function getCount(item: IncomingLog) {
  return Number(item.count ?? 0)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const logs: IncomingLog[] = Array.isArray(body.data) ? body.data : []
    const months: number[] = Array.isArray(body.months) ? body.months : []
    const year: number = Number(body.year) || new Date().getFullYear()

    // build list of satuan kerja (unique, preserve first-seen order)
    const skOrder: string[] = []
    const skSet = new Set<string>()
    for (const item of logs) {
      const name = getSatuanKerjaName(item)
      if (!skSet.has(name)) {
        skSet.add(name)
        skOrder.push(name)
      }
    }

    const workbook = new ExcelJS.Workbook()

    // buat 12 sheet
    for (const m of months) {
      const monthName = MONTH_NAMES[m - 1]
      const sheet = workbook.addWorksheet(monthName, { views: [{ showGridLines: true }] })

      // styling header (merge top row)
      sheet.mergeCells('A1', String.fromCharCode(65 + 3 + skOrder.length) + '1') // merge across columns
      const headerCell = sheet.getCell('A1')
      headerCell.value = monthName.toUpperCase()
      headerCell.alignment = { horizontal: 'center', vertical: 'middle' }
      headerCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
      headerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B0000' } } // maroon

      // space row
      sheet.addRow([])

      // header columns: left two columns for labels, then satuan kerja columns
      const headerRowValues = ['','', ...skOrder]
      const headerRow = sheet.addRow(headerRowValues)

      // style headerRow
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true }
        cell.alignment = { vertical: 'middle', horizontal: colNumber > 2 ? 'center' : 'left' }
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        }
        if (colNumber > 2) cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'FFF3F4F6' } }
      })

      // For each template block
      for (const block of TEMPLATE) {
        // block title row (colored)
        const titleRow = sheet.addRow([block.feature])
        const lastCol = 2 + skOrder.length
        sheet.mergeCells(`A${titleRow.number}:B${titleRow.number}`)
        const titleCell = sheet.getCell(`A${titleRow.number}`)
        titleCell.font = { bold: true, color: { argb: 'FF000000' } }
        // color depending on feature
        let fg = 'FF00FFFF' // cyan fallback
        if (block.feature === 'Informasi') fg = 'FF00F0F0' // turquoise-ish
        if (block.feature === 'Pengaduan') fg = 'FFFFA500' // orange
        if (block.feature === 'Administrasi') fg = 'FF7CFC00' // green
        titleCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: fg } }
        titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

        // rows
        for (const r of block.rows) {
          if (r.isSummary) {
            // summary row: left label and compute sums across that block
            const row = sheet.addRow([r.labelLeft, ''])
            // leave counts to be computed below: compute per satuan kerja across items in this block
            for (let i = 0; i < skOrder.length; i++) {
              const sk = skOrder[i]
              let sum = 0
              // count all logs for this block's feature (we'll approximate by checking log feature or subsub match)
              for (const item of logs) {
                const d = new Date(item.updatedAt)
                if ((d.getFullYear() === year) && (d.getMonth() + 1 === m)) {
                  // decide whether item belongs to this block
                  const subName = getSubSubName(item)
                  const belongs = (() => {
                    // if block has rows listing specific subSubs, check presence
                    // else fallback to checking feature text
                    // We'll check if any of block.rows contain subSub matching the item
                    for (const rr of block.rows) {
                      if (rr.subSub && typeof rr.subSub === 'string' && rr.subSub === subName) return true
                    }
                    // or if block.feature appears in item.feature
                    if (typeof item.feature === 'string' && item.feature.toLowerCase().includes(block.feature.toLowerCase())) return true
                    // else for administrasi nested, try checking subFeature or subSub
                    return false
                  })()

                  if (belongs && getSatuanKerjaName(item) === sk) sum += getCount(item)
                }
              }
              row.getCell(3 + i).value = sum
            }
            // style summary row
            row.eachCell((cell, colNumber) => {
              cell.font = { bold: true }
              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
              if (colNumber === 1) cell.alignment = { horizontal: 'left' }
              if (colNumber > 2) cell.alignment = { horizontal: 'center' }
            })
          } else if (r.children && Array.isArray(r.children)) {
            // parent row, then child rows
            const parentRow = sheet.addRow([r.labelLeft, ''])
            parentRow.eachCell((cell, idx) => {
              cell.font = { bold: true }
              cell.border = { top: { style:'thin' }, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} }
            })
            for (const child of r.children) {
              const row = sheet.addRow(['', child.labelRight])
              // compute counts per satuan kerja for this subSub (child.subSub)
              for (let i = 0; i < skOrder.length; i++) {
                const sk = skOrder[i]
                let sum = 0
                for (const item of logs) {
                  const d = new Date(item.updatedAt)
                  if ((d.getFullYear() === year) && (d.getMonth() + 1 === m)) {
                    const subName = getSubSubName(item)
                    if (subName === child.subSub && getSatuanKerjaName(item) === sk) {
                      sum += getCount(item)
                    }
                  }
                }
                row.getCell(3 + i).value = sum
              }
              row.eachCell((cell, colNumber) => {
                cell.border = { top: { style:'thin' }, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} }
                if (colNumber > 2) cell.alignment = { horizontal: 'center' }
              })
            }
          } else {
            // simple single row (labelLeft + labelRight)
            const row = sheet.addRow([r.labelLeft ?? '', r.labelRight ?? ''])
            for (let i = 0; i < skOrder.length; i++) {
              const sk = skOrder[i]
              let sum = 0
              for (const item of logs) {
                const d = new Date(item.updatedAt)
                if ((d.getFullYear() === year) && (d.getMonth() + 1 === m)) {
                  const subName = getSubSubName(item)
                  if (subName === r.subSub && getSatuanKerjaName(item) === sk) {
                    sum += getCount(item)
                  }
                }
              }
              row.getCell(3 + i).value = sum
            }
            row.eachCell((cell, colNumber) => {
              cell.border = { top: { style:'thin' }, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} }
              if (colNumber > 2) cell.alignment = { horizontal: 'center' }
            })
          }
        } // end rows loop
      } // end block loop

      // adjust columns width
      sheet.columns = [
        { key: 'col1', width: 28 },
        { key: 'col2', width: 40 },
        ...skOrder.map(() => ({ width: 18 }))
      ]
    } // end month loop

    // write to buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // return as response
    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Laporan Akses VA-BPJS ${year}.xlsx"`
      }
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, DynamicContent, Content, StyleDictionary, Table } from "pdfmake/interfaces";
import imgStr from './img'
import { NonCompliancesDTO, RecordDTO } from '@/types/dto'

type RecordQuantities = {
  name: string;
  total: number;
} & { [key: string]: number };

class PrintsService {

  constructor() { pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  private readonly styles: StyleDictionary = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [10, 20, 0, 10]
    },
    info: {
      fontSize: 14,
    },
    table: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 15,
      color: 'black'
    }
  }

  private readonly header: DynamicContent | Content = [{
    margin: [30, 10, 30, 5],
    columns: [{
      image: imgStr,
      width: 150,
    }, {
      margin: [10, 0, 0, 0],
      stack: [
        { text: 'Report Lavoro mese', fontSize: 11, bold: true },
        { text: 'Librilib(e)ri - www.libriliberi.bz.it', fontSize: 11, bold: false },
      ]
    }, {
      margin: [10, 0, 0, 0],
      stack: [
        { text: 'Libriliberi Società Cooperativa', fontSize: 11, bold: false },
        { text: 'C.F. e P.IVA 02610660215', fontSize: 11, bold: false },
        { text: 'Via Sorrento, 31', fontSize: 11, bold: false },
        { text: '39100 Bolzano (BZ)', fontSize: 11, bold: false },
        { text: 'PEC: libriliberi@pec.it', fontSize: 11, bold: false },
      ]
    }]
  }, {
    canvas: [{ type: 'line', x1: 30, y1: 0, x2: 595 - 30, y2: 0, lineWidth: 2 }]
  }];

  private readonly footer: DynamicContent | Content =  (currentPage: number, pageCount: number) => ({
    text: `Pagina ${currentPage}/${pageCount}`,
    alignment: 'right',
    margin: [40, 10, 40, 10],
  });

  private getNCQuantities(ncs: NonCompliancesDTO[]): RecordQuantities[] {
    const counts: { [id: string]: number } = {};

    for (const fn of ncs.filter(x => x.formatName).map(x => x.formatName) as string[]) {
      counts[fn] = counts[fn] ? counts[fn] + 1 : 1;
    }

    return Object.keys(counts).map(k => ({ name: k, total: counts[k] } as RecordQuantities));

  }

  private getRecordQuantities(records: RecordDTO[], by = (x: RecordDTO) => x.recordType): RecordQuantities[] {
    const typesByFormat: { [key: string]: string[] } = records.reduce((result, item) => ({
        ...result,
        [item.formatName ?? '']: [ ...((result as any)[item.formatName ?? ''] || []), by(item), ],
      }), {},
    );

    return Object.keys(typesByFormat).map(f => {
      return typesByFormat[f].reduce((rq, type) => {
        rq.total++;
        if (type in rq) {
          rq[type]++;
        } else {
          rq[type] = 1;
        }
        return rq;
      }, { name: f, total: 0 } as RecordQuantities);
    });
  }

  private getRecordTypeTable(recordQuantities: RecordQuantities[]): Table {
    return {
      widths: ['*', '*'],
      body: [
        [{ text: 'Formato', style: 'tableHeader', alignment: 'center' }, { text: 'Quantità', style: 'tableHeader', alignment: 'center' }],
        ...recordQuantities.map(r => [r.name, r.total])
      ]
    }
  }

  private getTypesTable(recordQuantities: RecordQuantities[]): Table {
    return {
      widths: ['*', '*', '*', '*', '*', '*'],
      body: [
        ['Formato', 'Nuovi', 'Modificati', 'Copie', 'Bonificati', 'Totale'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center' })),
        ...recordQuantities.map(r => [r.name, r['Nuovo'] ?? 0, r['Modificato'] ?? 0, r['Copia'] ?? 0, r['Bonificato'] ?? 0, r.total ?? 0])
      ]
    }
  }

  private getFormatType(recordQuantities: RecordQuantities[]): Table {
    return {
      widths: ['*', '*', '*', '*', '*', '*'],
      body: [
        ['Formato', 'Moderno', 'Pregio', 'Antico', 'Totale'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center' })),
        ...recordQuantities.map(r => [r.name, r['Moderno'] ?? 0, r['Pregio'] ?? 0, r['Antico'] ?? 0, r.total ?? 0])
      ]
    }
  }

  private getRecordTable(records: RecordDTO[]): Table {
    return {
      widths: ['*', '*', '*', '*'],
      body: [
        ['Record', 'Data', 'Tipo', 'NMC'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center', fillColor: '#FF0000', color: '#FFFFFF' })),
        ...records.map((r, i) =>
          [r.number, new Date(r.dateAdded).toLocaleDateString(), r.formatName ?? '', r.recordType].map(x => ({ text: x, fillColor: i % 2 === 0 ? '' : '#E0EBFF' }))
        )
      ]
    }
  }

  private getNCTable(records: NonCompliancesDTO[]): Table {
    return {
      widths: ['*', '*', '*'],
      body: [
        ['Record', 'Data', 'Tipo'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center', fillColor: '#FF0000', color: '#FFFFFF' })),
        ...records.map((r, i) =>
          [r.recordNumber, r.dateAdded ? new Date(r.dateAdded).toLocaleDateString() : '', r.formatName ?? ''].map(x => ({ text: x, fillColor: i % 2 === 0 ? '' : '#E0EBFF' }))
        )
      ]
    }
  }

  public printRecords(libraryName: string | null, dateStart: Date, dateEnd: Date, records: RecordDTO[]) {

    const recordQuantities = this.getRecordQuantities(records);
    const recordFormatTypeQuantities = this.getRecordQuantities(records, (x: RecordDTO) => x.found);

    this.printDocument([
      { text: libraryName ? `Biblioteca:\t${libraryName}` : 'Tutte le biblioteche', style: 'info' },
      { text: `Periodo:\t${dateStart.toLocaleDateString('it-IT')} - ${dateEnd.toLocaleDateString('it-IT')}`, style: 'info' },

      { text: 'Report generale', style: 'header' },
      { style: 'tableExample', table: this.getRecordTypeTable(recordQuantities) },
      
      { text: 'Report dettaglio', style: 'header' },
      { style: 'tableExample', table: this.getTypesTable(recordQuantities) },

      { text: 'Tipologia risorsa', style: 'header' },
      { style: 'tableExample', table: this.getFormatType(recordFormatTypeQuantities) },

      { text: 'Record', style: 'header' },
      { style: 'tableExample', table: this.getRecordTable(records) },
    ])
  }

  public printNC(libraryName: string | null, dateStart: Date, dateEnd: Date, ncs: NonCompliancesDTO[]) {

    const ncQuantities = this.getNCQuantities(ncs);

    this.printDocument([
      { text: libraryName ? `Biblioteca:\t${libraryName}` : 'Tutte le biblioteche', style: 'info' },
      { text: `Periodo:\t${dateStart.toLocaleDateString('it-IT')} - ${dateEnd.toLocaleDateString('it-IT')}`, style: 'info' },

      { text: 'Report generale', style: 'header' },
      { style: 'tableExample', table: this.getRecordTypeTable(ncQuantities) },
      
      { text: 'Non conformitá', style: 'header' },
      { style: 'tableExample', table: this.getNCTable(ncs) },
    ])
  }

  private printDocument(content: Content) {
    const doc: TDocumentDefinitions = {
      pageMargins: [40, 100, 40, 50],
      styles: this.styles,
      header: this.header,
      footer: this.footer,

      content: content,
    };

    pdfMake.createPdf(doc).open();
  }

}

export default new PrintsService();
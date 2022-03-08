import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, DynamicContent, Content, StyleDictionary, Table } from "pdfmake/interfaces";
import imgStr from './img'
import { RecordDTO } from '@/types/dto'

type RecordQuantities = {
  name: string;
  nuovi: number;
  modificati: number;
  copie: number;
  bonificati: number;
  total: number;
}

class PrintsService {

  constructor() { pdfMake.vfs = pdfFonts.pdfMake.vfs; }

  private readonly styles: StyleDictionary = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
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
    }]
  }, {
    canvas: [{ type: 'line', x1: 30, y1: 0, x2: 595 - 30, y2: 0, lineWidth: 2 }]
  }];

  private getRecordQuantities(records: RecordDTO[]): RecordQuantities[] {
    const typesByFormat: { [key: string]: string[] } = records.reduce((result, item) => ({
        ...result,
        [item.formatName ?? '']: [ ...((result as any)[item.formatName ?? ''] || []), item.recordType, ],
      }), {},
    );

    return Object.keys(typesByFormat).map(f => {
      return typesByFormat[f].reduce((rq, type) => {
        rq.total++;
        if (type === 'Nuovo')             rq.nuovi++;
        else if (type === 'Modificato')   rq.modificati++;
        else if (type === 'Copia')        rq.copie++;
        else if (type === 'Bonificato')   rq.bonificati++;
        return rq;
      }, { name: f, nuovi: 0, modificati: 0, copie: 0, bonificati: 0, total: 0 } as RecordQuantities);
    });
  }

  private getRecordTypeTable(recordQuantities: RecordQuantities[]): Table {
    return {
      widths: ['*', '*'],
      body: [
        [{ text: 'Tipo', style: 'tableHeader', alignment: 'center' }, { text: 'Quantità', style: 'tableHeader', alignment: 'center' }],
        ...recordQuantities.map(r => [r.name, r.total])
      ]
    }
  }

  private getTypesTable(recordQuantities: RecordQuantities[]): Table {
    return {
      widths: ['*', '*', '*', '*', '*', '*'],
      body: [
        ['Tipe', 'Nuovi', 'Modificati', 'Copie', 'Bonificati', 'Totale'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center' })),
        ...recordQuantities.map(r => [r.name, r.nuovi, r.modificati, r.copie, r.bonificati, r.total])
      ]
    }
  }

  private getRecordTable(records: RecordDTO[]): Table {
    return {
      body: [
        ['Record', 'Data', 'Tipo', 'NMC'].map(x => ({ text: x, style: 'tableHeader', alignment: 'center', fillColor: '#FF0000', color: '#FFFFFF' })),
        ...records.map((r, i) =>
          [r.number, new Date(r.dateAdded).toLocaleDateString(), r.formatName ?? '', r.recordType].map(x => ({ text: x, fillColor: i % 2 === 0 ? '' : '#E0EBFF' }))
        )
      ]
    }
  }

  public print(libraryName: string, records: RecordDTO[]) {

    const recordQuantities = this.getRecordQuantities(records);

    const doc: TDocumentDefinitions = {
      pageMargins: [40, 100, 40, 60],
      header: this.header,
      styles: this.styles,

      content: [
        { text: 'Tipi di record', style: 'header' },
        { style: 'tableExample', table: this.getRecordTypeTable(recordQuantities) },
        
        { text: 'Tipi', style: 'header' },
        { style: 'tableExample', table: this.getTypesTable(recordQuantities) },

        { text: 'Record', style: 'header' },
        { style: 'tableExample', table: this.getRecordTable(records) },
      ],

    };

    pdfMake.createPdf(doc).open();
  }

}

export default new PrintsService();
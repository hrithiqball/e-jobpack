import React, { FC, useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { Checklist, Maintenance } from '@prisma/client';
import { Result } from '../function/result';

interface PdfDownloadButtonProps {
  maintenance: Maintenance;
}

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

// PDF Document Component
const MyDocument: FC<{
  maintenance: Maintenance;
  checklistList: Checklist[];
}> = ({ maintenance, checklistList }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.text}>{maintenance.assetIds}</Text>
      <Text style={styles.text}>{checklistList.length}</Text>
    </Page>
  </Document>
);

// PDF Button Component
const PdfDownloadButton: FC<PdfDownloadButtonProps> = ({ maintenance }) => {
  let [checklistList, setChecklistList] = useState<Checklist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const checklistResult = await fetch(
        `/api/checklist?maintenanceId=${maintenance.id}`,
      ).then(async res => {
        const result: Result<Checklist[]> = await res.json();
        console.log(result);

        if (result.statusCode !== 200) {
          console.error(result.message);
          return;
        }

        const lol = result.data;
        if (lol !== undefined) {
          setChecklistList(lol);
          return;
        }
        console.error('lol is undefined');
      });
      console.log(checklistResult);
    };

    fetchData();
  }, [maintenance.id]);

  return (
    <PDFDownloadLink
      document={
        <MyDocument maintenance={maintenance} checklistList={checklistList} />
      }
      fileName="hello.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

export default PdfDownloadButton;

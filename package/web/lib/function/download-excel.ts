export async function handleDownloadExcel() {
  // const workbook = new Workbook();
  // const worksheetName = `${maintenance.id}`;
  // const filename = `Maintenance-${maintenance.id}`;
  // const title = `Maintenance ${maintenance.id}`;
  // const columns: Partial<Column>[] = [
  //   { key: 'no', width: 5 },
  //   { key: 'uid', width: 20 },
  //   { key: 'taskActivity', width: 40 },
  //   { key: 'remarks', width: 20 },
  //   { key: 'isComplete', width: 13, alignment: { horizontal: 'center' } },
  //   { key: 'F' },
  //   { key: 'G' },
  //   { key: 'H' },
  //   { key: 'I' },
  //   { key: 'J' },
  //   { key: 'K' },
  //   { key: 'L' },
  //   { key: 'M' },
  //   { key: 'N' },
  //   { key: 'O' },
  // ];
  // const borderWidth: Partial<Border> = { style: 'thin' };
  // const checklistResult = await fetch(
  //   `/api/checklist?maintenanceId=${maintenance.id}`,
  // ).then(res => res.json());
  // if (checklistResult !== 200 || checklistResult.data === undefined)
  //   throw new Error(checklistResult.statusMessage);
  // const saveExcel = async () => {
  //   try {
  //     let rowTracker = 7;
  //     const worksheet = workbook.addWorksheet(worksheetName);
  //     worksheet.columns = columns;
  //     const taskId = worksheet.getColumn('O');
  //     taskId.hidden = true;
  //     worksheet.mergeCells('A1:D1');
  //     const titleCell: Cell = worksheet.getCell('A1');
  //     titleCell.value = title;
  //     titleCell.font = { name: 'Calibri', size: 16, bold: true };
  //     titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     const imageId = workbook.addImage({
  //       base64: base64Image,
  //       extension: 'png',
  //     });
  //     worksheet.addImage(imageId, {
  //       tl: { col: 4.99, row: 0.1 },
  //       ext: { width: 53, height: 55 },
  //     });
  //     worksheet.getRow(1).height = 45;
  //     // Row 3
  //     worksheet.mergeCells('A3:B3');
  //     worksheet.mergeCells('C3:E3');
  //     worksheet.getCell('A3').value = 'Date';
  //     worksheet.getCell('C3').value = dayjs(maintenance.date).format(
  //       'DD/MM/YYYY',
  //     );
  //     // Row 4
  //     worksheet.mergeCells('A4:B4');
  //     worksheet.mergeCells('C4:E4');
  //     worksheet.getCell('A4').value = 'Location';
  //     worksheet.getCell('C4').value = maintenance.approvedById;
  //     // Row 5
  //     worksheet.mergeCells('A5:B5');
  //     worksheet.mergeCells('C5:E5');
  //     worksheet.getCell('A5').value = 'Tag No.';
  //     worksheet.getCell('C5').value = maintenance.attachmentPath;
  //     // Row 6
  //     worksheet.mergeCells('A6:B6');
  //     worksheet.mergeCells('C6:E6');
  //     worksheet.getCell('A6').value = 'Maintenance No.';
  //     worksheet.getCell('C6').value = maintenance.id;
  //     // Row 7
  //     worksheet.addRow([]);
  //     if (!checklistResult.data) {
  //       return;
  //     }
  //     for (const checklist of checklistResult.data) {
  //       const taskListResult: Result<Task[]> = await fetch(
  //         `/api/task?checklistId=${checklist.id}`,
  //       ).then(res => res.json());
  //       if (!taskListResult.data) return;
  //       worksheet.addRow([checklist.assetId]);
  //       rowTracker++;
  //       worksheet.getRow(rowTracker).font = {
  //         name: 'Calibri',
  //         size: 11,
  //         bold: true,
  //       };
  //       worksheet.mergeCells(`A${rowTracker}:E${rowTracker}`);
  //       worksheet.getRow(rowTracker).alignment = {
  //         horizontal: 'center',
  //         vertical: 'middle',
  //       };
  //       worksheet.addRow(['No.', 'Task', 'Description', 'Remarks', 'Value']);
  //       rowTracker++;
  //       worksheet.getRow(rowTracker).font = {
  //         name: 'Calibri',
  //         size: 11,
  //         bold: true,
  //       };
  //       worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
  //         cell.border = {
  //           top: borderWidth,
  //           left: borderWidth,
  //           bottom: borderWidth,
  //           right: borderWidth,
  //         };
  //       });
  //       for (const task of taskListResult.data) {
  //         worksheet.addRow([
  //           task.taskOrder,
  //           task.taskActivity ?? '',
  //           task.description ?? '',
  //           task.remarks ?? ' ',
  //         ]);
  //         rowTracker++;
  //         worksheet.getCell(`O${rowTracker}`).value = task.id;
  //         switch (task.taskType) {
  //           case 'MULTIPLE_SELECT':
  //           case 'SINGLE_SELECT':
  //             worksheet.getCell(`E${rowTracker}`).value = 'Select One';
  //             worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //               type: 'list',
  //               allowBlank: true,
  //               formulae: [`"${task.listChoice}"`],
  //               showInputMessage: true,
  //               promptTitle: 'Select',
  //               prompt: 'Please select value(s)',
  //             };
  //             break;
  //           case 'NUMBER':
  //             worksheet.getCell(`E${rowTracker}`).value = 0;
  //             worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //               type: 'decimal',
  //               allowBlank: true,
  //               formulae: [],
  //               showInputMessage: true,
  //               promptTitle: 'Number',
  //               prompt: 'The value must be in number',
  //             };
  //             break;
  //           case 'CHECK':
  //             worksheet.getCell(`E${rowTracker}`).value = 'Incomplete';
  //             worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //               type: 'list',
  //               allowBlank: false,
  //               formulae: [`"Completed, Incomplete"`],
  //               showInputMessage: true,
  //               promptTitle: 'Check',
  //               prompt: 'Check if completed',
  //             };
  //             break;
  //           case 'CHOICE':
  //             worksheet.getCell(`E${rowTracker}`).value = 'False';
  //             worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //               type: 'list',
  //               allowBlank: false,
  //               formulae: [`"True, False"`],
  //               showInputMessage: true,
  //               promptTitle: 'Choice',
  //               prompt: 'Select true or false',
  //             };
  //             break;
  //           default:
  //             worksheet.getCell(`E${rowTracker}`).value = 'Invalid';
  //             break;
  //         }
  //         worksheet.getRow(rowTracker).font = {
  //           name: 'Calibri',
  //           size: 11,
  //         };
  //         worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
  //           cell.border = {
  //             top: borderWidth,
  //             left: borderWidth,
  //             bottom: borderWidth,
  //             right: borderWidth,
  //           };
  //         });
  //         if (task.haveSubtask) {
  //           const subtaskListResult: Result<Subtask[]> = await fetch(
  //             `/api/subtask?taskId=${task.id}`,
  //           ).then(res => res.json());
  //           if (!subtaskListResult.data) return;
  //           console.log(subtaskListResult.data);
  //           for (const subtask of subtaskListResult.data) {
  //             const roman = convertToRoman(subtask.taskOrder);
  //             worksheet.addRow([
  //               roman,
  //               subtask.taskActivity ?? '',
  //               subtask.description ?? '',
  //               subtask.remarks ?? '',
  //             ]);
  //             rowTracker++;
  //             worksheet.getCell(`O${rowTracker}`).value = subtask.id;
  //             switch (subtask.taskType) {
  //               case 'MULTIPLE_SELECT':
  //               case 'SINGLE_SELECT':
  //                 worksheet.getCell(`E${rowTracker}`).value = 'Select One';
  //                 worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //                   type: 'list',
  //                   allowBlank: true,
  //                   formulae: [`"${subtask.listChoice}"`],
  //                   showInputMessage: true,
  //                   promptTitle: 'Select',
  //                   prompt: 'Please select value(s)',
  //                 };
  //                 break;
  //               case 'NUMBER':
  //                 worksheet.getCell(`E${rowTracker}`).value = 0;
  //                 worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //                   type: 'decimal',
  //                   allowBlank: true,
  //                   formulae: [],
  //                   showInputMessage: true,
  //                   promptTitle: 'Number',
  //                   prompt: 'The value must be in number',
  //                 };
  //                 break;
  //               case 'CHOICE':
  //                 worksheet.getCell(`E${rowTracker}`).value = 'False';
  //                 worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //                   type: 'list',
  //                   allowBlank: false,
  //                   formulae: [`"True, False"`],
  //                   showInputMessage: true,
  //                   promptTitle: 'Choice',
  //                   prompt: 'Select true or false',
  //                 };
  //                 break;
  //               case 'CHECK':
  //                 worksheet.getCell(`E${rowTracker}`).value = 'Incomplete';
  //                 worksheet.getCell(`E${rowTracker}`).dataValidation = {
  //                   type: 'list',
  //                   allowBlank: false,
  //                   formulae: [`"Completed, Incomplete"`],
  //                   showInputMessage: true,
  //                   promptTitle: 'Check',
  //                   prompt: 'Check if completed',
  //                 };
  //                 break;
  //               default:
  //                 worksheet.getCell(`E${rowTracker}`).value = 'Invalid';
  //                 break;
  //             }
  //             worksheet.getRow(rowTracker).eachCell((cell: Cell) => {
  //               cell.border = {
  //                 top: borderWidth,
  //                 left: borderWidth,
  //                 bottom: borderWidth,
  //                 right: borderWidth,
  //               };
  //             });
  //           }
  //         }
  //       }
  //       worksheet.addRow([]);
  //       rowTracker++;
  //     }
  //     // Border for title
  //     for (let i = 1; i <= 5; i++) {
  //       const cell = worksheet.getRow(1).getCell(i);
  //       cell.border = {
  //         top: borderWidth,
  //         bottom: borderWidth,
  //       };
  //       if (i === 1) {
  //         cell.border.left = borderWidth;
  //       } else if (i === 5) {
  //         cell.border.right = borderWidth;
  //       }
  //     }
  //     // Border for header
  //     for (let i = 3; i <= 6; i++) {
  //       worksheet.getRow(i).eachCell((cell: Cell) => {
  //         cell.border = {
  //           top: borderWidth,
  //           left: borderWidth,
  //           bottom: borderWidth,
  //           right: borderWidth,
  //         };
  //       });
  //     }
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     saveAs(new Blob([buffer]), `${filename}.xlsx`);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     workbook.removeWorksheet(worksheetName);
  //   }
  // };
  // await saveExcel();
  // toast.success('Excel file downloaded🎉');
}

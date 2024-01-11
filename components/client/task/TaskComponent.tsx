'use client';

import React, { useEffect, useState } from 'react';
import { Maintenance } from '@prisma/client';
import Loading from '@/components/client/Loading';
import { Button, Card, CardHeader, Chip, Divider } from '@nextui-org/react';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function TaskComponent({
  maintenanceList,
}: {
  maintenanceList: Maintenance[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;
  return (
    <div className="flex rounded-md flex-grow">
      <div className="flex flex-col space-y-4 h-full w-full sm:flex-row sm:space-y-0 sm:space-x-4">
        <Card className="flex-1 p-4 w-100">
          <div>
            <p className="text-lg font-semibold text-center mb-4">
              My Tasks{' '}
              <Chip size="sm" variant="faded">
                {maintenanceList.length}
              </Chip>
            </p>
            <Divider />
            {maintenanceList.map(maintenance => (
              <Card key={maintenance.id} className="w-full my-4">
                <CardHeader className="flex gap-3">
                  <Button color="danger" isIconOnly>
                    <Wrench />
                  </Button>
                  <div className="flex flex-col">
                    <Link
                      href={{
                        pathname: `/task/${maintenance.id}`,
                        query: {
                          maintenance: JSON.stringify(maintenance),
                        },
                      }}
                      className="text-md font-bold"
                    >
                      {maintenance.id}
                    </Link>
                    <p className=" text-sm">Maintenance ID: {maintenance.id}</p>
                  </div>
                </CardHeader>
                {/* <CardBody>
									{nestedMaintenance.checklists.map(
										(checklist: NestedChecklist) => (
											<div key={checklist.uid}>
												<div className="flex justify-between items-center mb-4">
													<p className="text-md font-semibold">
														{checklist.title}
													</p>
													<div className="flex items-center">
														<Button className="mr-1" variant="faded" isIconOnly>
															<FaRegFilePdf />
														</Button>
														<Button
															// onClick={() =>
															// 	exportToExcel(checklist, nestedMaintenance)
															// }
															variant="faded"
															isIconOnly
														>
															<FaRegFileExcel />
														</Button>
													</div>
												</div>
												{checklist.tasks.map((task: task) => (
													<div
														className="flex gap-3 items-center mb-1"
														key={checklist.uid}
													>
														<Checkbox
															isSelected={task.is_complete}
															onValueChange={() => {
																task.is_complete = !task.is_complete;
																console.log(task.is_complete);
															}}
														>
															{task.task_activity}
														</Checkbox>
													</div>
												))}
											</div>
										)
									)}
								</CardBody> */}
                {/* <CardFooter>
									<ButtonGroup>
										<Button
											color="primary"
											variant="faded"
											startContent={<FaRegFileExcel />}
											onClick={() => {
												// handleButtonClick();
												setSelectedMaintenance(nestedMaintenance);
											}}
										>
											{nestedMaintenance.fileName ?? "Upload Excel"}
										</Button>
										<input
											type="file"
											ref={fileInputRef}
											className="hidden"
											accept=".xlsx, .xls"
											// onChange={handleFileChange}
										/>
										<Button
											color="primary"
											variant="faded"
											isIconOnly
											isDisabled={!nestedMaintenance.fileName}
											isLoading={nestedMaintenance.loadingReadExcel}
											onClick={() => {
												setSelectedMaintenance(nestedMaintenance);
												// importExcel();
											}}
										>
											{nestedMaintenance.loadingReadExcel ? (
												<Fragment></Fragment>
											) : (
												<AiOutlineCloudSync />
											)}
										</Button>
									</ButtonGroup>
								</CardFooter> */}
              </Card>
            ))}
          </div>
        </Card>
        <Card className="flex-1 p-4">
          <div>
            <p className="text-lg font-semibold text-center mb-4">
              Completed Tasks
            </p>
            <Divider />
          </div>
        </Card>
        <Card className="flex-1 p-4">
          <div>
            <p className="text-lg font-semibold text-center mb-4">
              Upcoming Tasks
            </p>
            <Divider />
          </div>
        </Card>
      </div>
    </div>
  );
}

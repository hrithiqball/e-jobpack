import React from 'react';
import { maintenance } from '@prisma/client';

function ChecklistMaintenance(props: maintenance) {
  return <div>{props.uid}</div>;
}

export default ChecklistMaintenance;

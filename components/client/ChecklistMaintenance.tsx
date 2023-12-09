import React from 'react';
import { maintenance } from '@prisma/client';

export default function ChecklistMaintenance(props: maintenance) {
  return <div>{props.uid}</div>;
}

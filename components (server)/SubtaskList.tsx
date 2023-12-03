import SubtaskItem from "@/components/SubtaskItem";
import { subtask } from "@prisma/client";
import React, { Fragment } from "react";

export default function SubtaskList({
	subtaskList,
}: {
	subtaskList: subtask[];
}) {
	return (
		<Fragment>
			{subtaskList.map((subtask) => (
				<SubtaskItem key={subtask.uid} subtask={subtask} />
			))}
		</Fragment>
	);
}

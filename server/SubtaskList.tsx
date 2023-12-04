import React, { Fragment } from "react";
import SubtaskItem from "@/components/SubtaskItem";
import { subtask } from "@prisma/client";

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

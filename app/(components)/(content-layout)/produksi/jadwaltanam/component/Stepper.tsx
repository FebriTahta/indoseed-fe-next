'use client';

import React from 'react';

export interface StepItem {
	id: number;
	title: string;
	description: string;
}

interface StepperProps {
	items: StepItem[];
	current: number;
	onChange?: (step: number) => void;
}

export default function Stepper({
	items,
	current,
	onChange,
}: StepperProps) {

	return (

		<div className="w-full rounded-xl border bg-white p-6">

			<div className="flex items-center">

				{items.map((item, index) => {

					const active = item.id === current;
					const completed = item.id < current;

					return (

						<React.Fragment key={item.id}>

							<div
								className={`flex items-start gap-3 ${onChange ? 'cursor-pointer' : ''
									}`}
								onClick={() => onChange?.(item.id)}
							>

								<div
									className={`
										flex
										h-9
										w-9
										shrink-0
										items-center
										justify-center
										rounded-full
										border
										text-sm
										font-semibold
										transition-all
										
										${active
											? 'bg-green-600 border-green-600 text-white'
											: completed
												? 'bg-green-100 border-green-600 text-green-700'
												: 'bg-white border-gray-300 text-gray-500'
										}
									`}
								>
									{item.id}
								</div>

								<div>

									<div
										className={`text-sm font-semibold ${active
											? 'text-gray-900'
											: 'text-gray-600'
											}`}
									>
										{item.title}
									</div>

									<div className="text-xs text-gray-400">
										{item.description}
									</div>

								</div>

							</div>

							{index !== items.length - 1 && (

								<div className="mx-5 flex-1">

									<div
										className={`
											mt-4
											h-[2px]
											w-full
											
											${completed
												? 'bg-green-500'
												: 'bg-gray-200'
											}
										`}
									/>

								</div>

							)}

						</React.Fragment>

					);

				})}

			</div>

		</div>

	);

}
import React from "react";
import { useState, useEffect } from "react";

const DocumentRequirements = ({ documents, onUpdate }) => {
	const [newDocument, setNewDocument] = useState({
		name: "",
		description: "",
		required: true,
	});

	const handleAddDocument = () => {
		if (newDocument.name.trim()) {
			onUpdate([...documents, { ...newDocument }]);
			setNewDocument({ name: "", description: "", required: true });
		}
	};

	const handleRemoveDocument = (index) => {
		const updatedDocs = documents.filter((_, i) => i !== index);
		onUpdate(updatedDocs);
	};

	return (
		<div className='dmodal'>
			<h4>Required Documents</h4>

			{documents?.map((doc, index) => (
				<div key={index} id='doc2'>
					<div className='dmodaldoc'>
						<div id='dmodaldocont'>
							<div>{doc.name}</div>
							<div>{doc.required ? "*" : ""}</div>
						</div>

						<p>{doc.description}</p>
					</div>
					<button
						className='serviceDelete'
						onClick={() => handleRemoveDocument(index)}>
						<i class='fa-regular fa-trash-can fa-xl'></i>
					</button>
				</div>
			))}

			{/* Add new document form */}
			<div className='dmodal'>
				<input
					type='text'
					placeholder='Document Name'
					value={newDocument.name}
					onChange={(e) =>
						setNewDocument({ ...newDocument, name: e.target.value })
					}
				/>
				<input
					type='text'
					placeholder='Description'
					value={newDocument.description}
					onChange={(e) =>
						setNewDocument({ ...newDocument, description: e.target.value })
					}
				/>
				<div id='sreq'>
					<input
						type='checkbox'
						checked={newDocument.required}
						onChange={(e) =>
							setNewDocument({ ...newDocument, required: e.target.checked })
						}
					/>
					<label>Required</label>
				</div>
				<button id='addDoc' onClick={handleAddDocument}>
					Add Document
				</button>
			</div>
		</div>
	);
};

export default DocumentRequirements;

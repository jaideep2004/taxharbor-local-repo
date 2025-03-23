// import React from "react";
// import { useState, useEffect } from "react";

// const DocumentRequirements = ({ documents, onUpdate }) => {
// 	const [newDocument, setNewDocument] = useState({
// 		name: "",
// 		description: "",
// 		required: true,
// 	});

// 	const handleAddDocument = () => {
// 		if (newDocument.name.trim()) {
// 			onUpdate([...documents, { ...newDocument }]);
// 			setNewDocument({ name: "", description: "", required: true });
// 		}
// 	};

// 	const handleRemoveDocument = (index) => {
// 		const updatedDocs = documents.filter((_, i) => i !== index);
// 		onUpdate(updatedDocs);
// 	};

// 	return (
// 		<div className='dmodal'>
// 			<h4>Required Documents</h4>

// 			{documents?.map((doc, index) => (
// 				<div key={index} id='doc2'>
// 					<div className='dmodaldoc'>
// 						<div id='dmodaldocont'>
// 							<div>{doc.name}</div>
// 							<div>{doc.required ? "*" : ""}</div>
// 						</div>

// 						<p>{doc.description}</p>
// 					</div>
// 					<button
// 						className='serviceDelete'
// 						onClick={() => handleRemoveDocument(index)}>
// 						<i class='fa-regular fa-trash-can fa-xl'></i>
// 					</button>
// 				</div>
// 			))}

// 			{/* Add new document form */}
// 			<div className='dmodal'>
// 				<input
// 					type='text'
// 					placeholder='Document Name'
// 					value={newDocument.name}
// 					onChange={(e) =>
// 						setNewDocument({ ...newDocument, name: e.target.value })
// 					}
// 				/>
// 				<input
// 					type='text'
// 					placeholder='Description'
// 					value={newDocument.description}
// 					onChange={(e) =>
// 						setNewDocument({ ...newDocument, description: e.target.value })
// 					}
// 				/>
// 				<div id='sreq'>
// 					<input
// 						type='checkbox'
// 						checked={newDocument.required}
// 						onChange={(e) =>
// 							setNewDocument({ ...newDocument, required: e.target.checked })
// 						}
// 					/>
// 					<label>Required</label>
// 				</div>
// 				<button id='addDoc' onClick={handleAddDocument}>
// 					Add Document
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

// export default DocumentRequirements;

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const DocumentRequirements = ({ documents, onUpdate }) => {
	const [newDocument, setNewDocument] = useState({
		name: "",
		description: "",
		required: true,
	});
	const [showAddDialog, setShowAddDialog] = useState(false);

	const handleAddDocument = () => {
		if (newDocument.name.trim()) {
			onUpdate([...documents, { ...newDocument }]);
			setNewDocument({ name: "", description: "", required: true });
			setShowAddDialog(false);
		}
	};

	const handleRemoveDocument = (index) => {
		const updatedDocs = documents.filter((_, i) => i !== index);
		onUpdate(updatedDocs);
	};

	return (
		<div className='dmodal'>
			<Typography
				variant='h6'
				component='h4'
				gutterBottom
				style={{ marginTop: "15px" }}>
				Required Documents
			</Typography>

			<List>
				{documents?.map((doc, index) => (
					<ListItem
						key={index}
						secondaryAction={
							<IconButton
								edge='end'
								aria-label='delete'
								onClick={() => handleRemoveDocument(index)}
								className='serviceDelete'>
								<DeleteIcon />
							</IconButton>
						}>
						<ListItemText
							primary={
								<span>
									{doc.name}
									{doc.required && <span style={{ color: "red" }}> *</span>}
								</span>
							}
							secondary={doc.description}
						/>
					</ListItem>
				))}
			</List>

			{/* Add new document form as MUI Dialog */}
			<Button
				variant='contained'
				onClick={() => setShowAddDialog(true)}
				style={{ marginTop: "16px" }}>
				Add New Document
			</Button>

			<Dialog
				open={showAddDialog}
				onClose={() => setShowAddDialog(false)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Add New Document</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Document Name'
						fullWidth
						value={newDocument.name}
						onChange={(e) =>
							setNewDocument({ ...newDocument, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Description'
						fullWidth
						value={newDocument.description}
						onChange={(e) =>
							setNewDocument({ ...newDocument, description: e.target.value })
						}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={newDocument.required}
								onChange={(e) =>
									setNewDocument({ ...newDocument, required: e.target.checked })
								}
							/>
						}
						label='Required'
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAddDocument}>Add Document</Button>
					<Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DocumentRequirements;

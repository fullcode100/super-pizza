function Modal({ id, children, title, buttonName, handleValid }) {
	return (
		<div className="modal fade" id={id} data-backdrop="false" aria-labelledby={`${id}Label`} aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id={`${id}Label`}>
							{title}
						</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div className="modal-body">{children}</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
							Fermer
						</button>
						<button type="button" onClick={handleValid} className="btn btn-primary">
							{buttonName}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;

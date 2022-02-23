export const Panel = ({ children }: { children: JSX.Element }) => {
	return(
		<div className="bg-white rounded-md shadow-lg p-4">
			{children}
		</div>
	)
}

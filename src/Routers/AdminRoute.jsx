import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const AdminRoute = ({ children }) => {
	const { auth } = useSelector((store) => store);
	const location = useLocation();
	const jwt = localStorage.getItem("jwt");

	const REQUIRED_ROLE = "admin";

	if (!jwt) {
		console.warn("ADMIN ROUTE: JWT not found. Redirecting to login.");
		return (
			<Navigate to="/super-admin/login" state={{ from: location }} replace />
		);
	}

	if (jwt && !auth.user) {
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				Loading Super Admin Data...
			</div>
		);
	}

	if (auth.user) {
		const userRole = auth.user.role;

		console.log(` DEBUG: Current User Role in Redux is: "${userRole}"`);

		if (userRole !== REQUIRED_ROLE) {
			console.error(
				`ACCESS DENIED: Required Role: "${REQUIRED_ROLE}", but user has: "${userRole}". Redirecting to /`
			);
			return (
				<Navigate to="/super-admin/login" state={{ from: location }} replace />
			);
		}
	} else {
		console.error(
			"ADMIN ROUTE: Logic Error - JWT exists but auth.user is missing. Redirecting to /"
		);
		return (
			<Navigate to="/super-admin/login" state={{ from: location }} replace />
		);
	}

	console.log(" ACCESS GRANTED: User is Super Admin.");
	return children;
};

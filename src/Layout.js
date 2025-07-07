import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, BarChart3, Upload, Trophy, Settings, Menu, X, LogOut } from "lucide-react";
import PropTypes from 'prop-types';

const navigationItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: BarChart3,
		description: "View your progress"
	},
	{
		title: "Upload",
		url: "/upload",
		icon: Upload,
		description: "Upload new document"
	}
];

export default function Layout({ children }) {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		// Close the menu when the route changes
		setIsOpen(false);
	}, [location]);

	return (
		<div className="flex flex-col h-screen">
			<div className="flex flex-1">
				<aside className={`bg-background p-4 w-64 ${isOpen ? "block" : "hidden"} md:block`}>
					<div className="flex items-center justify-between">
						<h1 className="text-lg font-semibold">My App</h1>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="md:hidden p-2 rounded-md text-muted hover:bg-muted/20 transition-colors"
						>
							{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</button>
					</div>
					<nav className="mt-4">
						{navigationItems.map((item) => (
							<Link
								key={item.title}
								to={item.url}
								className="flex items-center p-2 text-sm font-medium rounded-md hover:bg-muted/20 transition-colors"
							>
								<item.icon className="w-5 h-5 mr-3" />
								{item.title}
							</Link>
						))}
					</nav>
					<div className="mt-auto">
						<div className="relative">
							<button className="w-full text-left flex items-center p-2 text-sm font-medium rounded-md hover:bg-muted/20 transition-colors">
								Account
							</button>
							<div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
								<Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted/20 transition-colors">
									Profile
								</Link>
								<Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted/20 transition-colors">
									Settings
								</Link>
								<div className="border-t border-gray-200"></div>
								<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-muted/20 transition-colors">
									<LogOut className="w-4 h-4 mr-2" />
									Logout
								</button>
							</div>
						</div>
					</div>
				</aside>
				<div className="flex-1 p-6 bg-muted">{children}</div>
			</div>
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

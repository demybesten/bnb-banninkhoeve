// components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-amber-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Cozy B&B</h3>
                        <p>Your home away from home in the heart of the city.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact</h3>
                        <p>123 Main Street</p>
                        <p>City, State 12345</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Email: info@cozybnb.com</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/rooms" className="hover:text-amber-300">Our Rooms</a></li>
                            <li><a href="/about" className="hover:text-amber-300">About Us</a></li>
                            <li><a href="/contact" className="hover:text-amber-300">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-amber-700 text-center">
                    <p>&copy; 2024 Cozy B&B. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
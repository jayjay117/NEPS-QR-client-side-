"use client";

// Access components from global scope
const QRGenerator = window.QRGenerator;
const WithdrawForm = window.WithdrawForm;

// Utility functions
const generateBusinessId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array(8).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const BusinessApp = () => {
    const [currentBusiness, setCurrentBusiness] = React.useState(null);
    const [toast, setToast] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!localStorage.getItem("nqr_businesses")) {
            localStorage.setItem("nqr_businesses", JSON.stringify([]));
        }

        const businessId = localStorage.getItem("nqr_current_business");
        if (businessId) {
            const business = getBusinessById(businessId);
            if (business) setCurrentBusiness(business);
        }
        setLoading(false);
        initLucideIcons();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("nqr_current_business");
        setCurrentBusiness(null);
        setToast({ message: "Logged out successfully", type: "info" });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            {currentBusiness ? (
                <BusinessDashboard
                    business={currentBusiness}
                    onLogout={handleLogout}
                    showToast={setToast}
                />
            ) : (
                <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white p-4">
                    <div className="max-w-md mx-auto pt-10">
                        <div className="text-center mb-8 fade-in">
                            <h1 className="text-3xl font-bold text-primary-700 mb-2">NQR Business</h1>
                            <p className="text-gray-600">Business Portal</p>
                        </div>
                        <AuthForm
                            onLogin={(business) => {
                                localStorage.setItem("nqr_current_business", business.id);
                                setCurrentBusiness(business);
                            }}
                            showToast={setToast}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const AuthForm = ({ onLogin, showToast }) => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [formData, setFormData] = React.useState({
        fullName: "",
        businessName: "",
        phone: "",
        tin: "",
        location: "Lagos",
        category: "Retail",
        bankName: "",
        accountNumber: "",
        password: "",
    });

    const nigerianStates = ["Lagos", "Abuja", "Kano", "Oyo", "Rivers", "Delta", "Enugu"];

    const handleSignup = (e) => {
        e.preventDefault();
        const newBusiness = {
            id: generateBusinessId(),
            regNo: `BN-${generateBusinessId()}`,
            ...formData,
            pinHash: sha256(formData.password),
            wallet: 0,
            transactions: [],
            withdrawals: [],
            createdAt: new Date().toISOString()
        };

        const businesses = JSON.parse(localStorage.getItem("nqr_businesses") || "[]");
        businesses.push(newBusiness);
        localStorage.setItem("nqr_businesses", JSON.stringify(businesses));
        onLogin(newBusiness);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const businesses = JSON.parse(localStorage.getItem("nqr_businesses") || "[]");
        const business = businesses.find(
            (b) => b.id === formData.id && b.pinHash === sha256(formData.password)
        );
        
        if (business) {
            onLogin(business);
            showToast({ message: "Login successful!", type: "success" });
        } else {
            showToast({ message: "Invalid credentials", type: "error" });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isLogin ? "Business Login" : "Create Business Account"}
            </h2>

            {!isLogin && (
                <div className="space-y-4">
                    {/* Signup form fields */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    {/* Additional signup fields */}
                </div>
            )}

            {isLogin && (
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Business ID</label>
                        <input
                            type="text"
                            required
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </form>
            )}

            <button
                type="submit"
                className="w-full bg-primary-600 text-white p-2 rounded-lg mt-4"
                onClick={isLogin ? handleLogin : handleSignup}
            >
                {isLogin ? "Login" : "Create Account"}
            </button>

            <p className="text-center mt-4">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    type="button"
                    className="text-primary-600"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Sign up" : "Login"}
                </button>
            </p>
        </div>
    );
};

const BusinessDashboard = ({ business, onLogout, showToast }) => {
    // ... (keep existing BusinessDashboard implementation) ...
};

const TransactionHistory = ({ business }) => {
    return (
        <div className="bg-white rounded-xl shadow-md">
            <h3 className="p-4 border-b border-gray-100 font-semibold">Transaction History</h3>
            {business.transactions.map((txn, index) => (
                <div key={index} className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">{txn.purpose}</p>
                            <p className="text-sm text-gray-500">{formatDate(txn.timestamp)}</p>
                        </div>
                        <p className={`${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Utility functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateString));
};

const getBusinessById = (id) => {
    const businesses = JSON.parse(localStorage.getItem("nqr_businesses") || "[]");
    return businesses.find((b) => b.id === id);
};

const processWithdrawal = (businessId, bank, accountNumber, amount) => {
    const businesses = JSON.parse(localStorage.getItem("nqr_businesses") || "[]");
    const business = businesses.find((b) => b.id === businessId);

    if (!business) return { success: false, message: "Business not found" };
    if (business.wallet < amount) return { success: false, message: "Insufficient funds" };

    const fee = Math.round(amount * 0.0007);
    const finalAmount = amount - fee;

    business.wallet -= amount;
    business.withdrawals.push({
        bank,
        accountNumber,
        amount,
        fee,
        finalAmount,
        timestamp: new Date().toISOString(),
    });

    localStorage.setItem("nqr_businesses", JSON.stringify(businesses));
    return { success: true, message: "Withdrawal processed", details: { amount, fee, finalAmount } };
};

const initLucideIcons = () => {
    if (window.lucide) window.lucide.createIcons();
};

const Toast = ({ message, type, onClose }) => {
    // ... (keep existing Toast implementation) ...
};

// Initialize the app
const root = document.getElementById("root");
ReactDOM.render(<BusinessApp />, root);
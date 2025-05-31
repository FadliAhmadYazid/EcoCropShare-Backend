import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function Loading() {
    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading messages...</p>
                </div>
            </div>
            <Footer />
        </>
    );
}
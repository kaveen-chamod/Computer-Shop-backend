import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ViewOrderInfo from "../../components/viewOrderInfo";
import getFormattedPrice from "../../utils/priceFormatter";
// අලුතින් හැදූ Date formatter එක Import කරගැනීම
import getFormattedDate from "../../Utils/Date-Format";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");

      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setOrders(response.data);
          setLoaded(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loaded]);

  return (
    <div className="w-full min-h-screen bg-primary flex justify-center p-10">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden relative">

        {/* Header */}
        <div className="px-8 py-6 bg-accent text-primary">
          <h1 className="text-2xl font-bold tracking-wide">
            Order Management
          </h1>
        </div>

        <div className="overflow-x-auto">
          {loaded ? (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-accent uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer Email</th>
                  <th className="px-5 py-4">Customer Name</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Total Amount</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-5 py-4 font-semibold text-accent">
                      {order.orderId}
                    </td>

                    <td className="px-5 py-4 font-semibold text-accent">
                      {order.email}
                    </td>

                    <td className="px-5 py-4 font-semibold text-accent">
                      {order.name}
                    </td>

                    <td className="px-5 py-4 font-semibold text-accent whitespace-nowrap">
                      {/* අලුත් Date formatter එක මෙහි යොදා ඇත */}
                      {getFormattedDate(order.date)}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                        order.status === 'pending' || order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'completed' || order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-800 whitespace-nowrap">
                      {getFormattedPrice(order.totalAmount)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-accent text-center">
                      <ViewOrderInfo
                        order={order}
                        onSaveChanges={() => setLoaded(false)}
                      />
                    </td>
                  </tr>
                ))}
                
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      No orders found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
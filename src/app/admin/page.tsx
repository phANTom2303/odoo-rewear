"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Eye,
  Trash2,
  Users,
  Package,
  ArrowUpDown,
} from "lucide-react";
import Header from "../../components/header";

export default function AdminPage() {
  // Remove authentication-related state
  // const [currentUser, setCurrentUser] = useState<any>(null)
  // const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("pending");
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Remove authentication checks
  // useEffect(() => {
  //   checkAdminAccess()
  // }, [router])

  // useEffect(() => {
  //   if (isAdmin) {
  //     // loadData()
  //   }
  // }, [isAdmin, activeTab])

  // Remove authentication function
  // const checkAdminAccess = async () => {
  //   try {
  //     const user = await getCurrentUser()
  //     if (!user) {
  //       router.push("/auth/login")
  //       return
  //     }
  //     const profile = await getUserProfile(user.id)
  //     if (!profile.is_admin) {
  //       router.push("/dashboard")
  //       return
  //     }
  //     setCurrentUser(user)
  //     setIsAdmin(true)
  //   } catch (error) {
  //     console.error("Error checking admin access:", error)
  //     router.push("/dashboard")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (
        activeTab === "pending" ||
        activeTab === "approved" ||
        activeTab === "rejected"
      ) {
        let status = activeTab;
        if (activeTab === "approved") status = "available";

        const res = await fetch(`/api/admin/items?status=${status}`);
        const data = await res.json();

        if (data.success) {
          setItems(data.items || []);
        } else {
          console.error("Error loading items:", data.error);
          setItems([]);
        }
      }
      // TODO: Implement users and swaps loading when needed
    } catch (error) {
      console.error("Error loading data:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // const loadData = async () => {
  //   try {
  //     if (activeTab === "pending" || activeTab === "approved") {
  //       const { data: itemsData } = await supabase
  //         .from("items")
  //         .select(`
  //           *,
  //           profiles (username, full_name)
  //         `)
  //         .eq("status", activeTab)
  //         .order("created_at", { ascending: false })

  //       setItems(itemsData || [])
  //     } else if (activeTab === "users") {
  //       const { data: usersData } = await supabase
  //         .from("profiles")
  //         .select("*")
  //         .order("created_at", { ascending: false })

  //       setUsers(usersData || [])
  //     } else if (activeTab === "swaps") {
  //       const { data: swapsData } = await supabase
  //         .from("swaps")
  //         .select(`
  //           *,
  //           items (title),
  //           profiles!swaps_requester_id_fkey (username),
  //           profiles!swaps_owner_id_fkey (username)
  //         `)
  //         .order("created_at", { ascending: false })

  //       setSwaps(swapsData || [])
  //     }
  //   } catch (error) {
  //     console.error("Error loading data:", error)
  //   }
  // }

  const handleItemAction = async (
    itemId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const res = await fetch("/api/admin/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          action,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Item ${action}d successfully`);
        // Reload the data to reflect changes
        loadData();
      } else {
        throw new Error(data.error || `Failed to ${action} item`);
      }
    } catch (error) {
      console.error(`Error ${action}ing item:`, error);
      alert(`Failed to ${action} item: ${error.message}`);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`/api/admin/items?itemId=${itemId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
          alert("Item deleted successfully");
          // Reload the data to reflect changes
          loadData();
        } else {
          throw new Error(data.error || "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert(`Failed to delete item: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  // Remove admin check
  // if (!isAdmin) {
  //   return (
  //     <div className="min-h-screen bg-neutral-50">
  //       <Header />
  //       <div className="text-center py-12">
  //         <h2 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h2>
  //         <p className="text-neutral-600 mb-6">You don't have permission to access this page</p>
  //         <button onClick={() => router.push("/dashboard")} className="btn-primary">
  //           Go to Dashboard
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-neutral-600">Manage items, users, and swaps</p>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
            {[
              { id: "pending", label: "Pending Items", icon: Package },
              { id: "approved", label: "Approved Items", icon: Check },
              { id: "rejected", label: "Rejected Items", icon: X },
              { id: "users", label: "Users", icon: Users },
              { id: "swaps", label: "Swaps", icon: ArrowUpDown },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {(activeTab === "pending" ||
          activeTab === "approved" ||
          activeTab === "rejected") && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No {activeTab} items
                </h3>
                <p className="text-neutral-600">
                  All items have been processed
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-start space-x-6">
                    <img
                      src={
                        item.images?.[0] ||
                        "/placeholder.svg?height=100&width=100"
                      }
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-neutral-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-500">
                        <span>{item.category}</span>
                        <span>{item.condition}</span>
                        <span>${item.cost}</span>
                        <span>{item.size || "One Size"}</span>
                        <span>
                          Created:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags
                          ?.slice(0, 3)
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        {item.tags?.length > 3 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {activeTab === "approved" && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Approved
                        </span>
                      )}
                      {activeTab === "rejected" && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Rejected
                        </span>
                      )}
                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() => handleItemAction(item.id, "approve")}
                            className="p-2 text-green-600 hover:text-green-700 border border-green-300 rounded-lg"
                            title="Approve Item"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleItemAction(item.id, "reject")}
                            className="p-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                            title="Reject Item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                        title="Delete Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Points</th>
                    <th className="text-left py-3 px-4">Admin</th>
                    <th className="text-left py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-neutral-900">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-neutral-600">
                            @{user.username}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {user.points}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.is_admin
                              ? "bg-primary-100 text-primary-800"
                              : "bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          {user.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "swaps" && (
          <div className="space-y-4">
            {swaps.length === 0 ? (
              <div className="text-center py-12">
                <ArrowUpDown className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No swaps yet
                </h3>
                <p className="text-neutral-600">
                  Swaps will appear here once users start trading
                </p>
              </div>
            ) : (
              swaps.map((swap) => (
                <div key={swap.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {swap.items?.title}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        @{swap.profiles?.username} → @{swap.profiles?.username}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {new Date(swap.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        swap.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : swap.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : swap.status === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {swap.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

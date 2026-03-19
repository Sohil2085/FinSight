export const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const getMe = async (token) => {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user");
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (token, userData) => {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || "Failed to update user");
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateCompany = async (token, companyData) => {
    try {
        const response = await fetch(`${API_URL}/company/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(companyData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || "Failed to update company");
        return data;
    } catch (error) {
        throw error;
    }
};

/* --- Invoice APIs --- */

export const getInvoices = async (token, filters = {}) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/invoices?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch invoices");
        return data;
    } catch (error) {
        throw error;
    }
};

export const getInvoiceSummary = async (token) => {
    try {
        const response = await fetch(`${API_URL}/invoices/summary`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch summary");
        return data;
    } catch (error) {
        throw error;
    }
};

export const createInvoice = async (token, invoiceData) => {
    try {
        const response = await fetch(`${API_URL}/invoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(invoiceData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create invoice");
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateInvoiceStatus = async (token, id, status) => {
    try {
        const response = await fetch(`${API_URL}/invoices/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update status");
        return data;
    } catch (error) {
        throw error;
    }
};

/* --- Expense APIs --- */

export const getExpenses = async (token, filters = {}) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/expenses?${query}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch expenses");
        return data;
    } catch (error) {
        throw error;
    }
};

export const getExpenseSummary = async (token) => {
    try {
        const response = await fetch(`${API_URL}/expenses/summary`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch expense summary");
        return data;
    } catch (error) {
        throw error;
    }
};

export const createExpense = async (token, expenseData) => {
    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(expenseData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create expense");
        return data;
    } catch (error) {
        throw error;
    }
};

/* --- Categorization APIs --- */

export const categorizeExpense = async (token, description) => {
  try {
    const response = await fetch(`${API_URL}/ai/categorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid AI response");
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to categorize");
    }

    return data;

  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};
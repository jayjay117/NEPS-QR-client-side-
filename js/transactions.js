// This file contains additional functionality for the transactions page
// It can be included in the transactions.html file if needed

document.addEventListener("DOMContentLoaded", () => {
    // Initialize any additional components or functionality specific to the transactions page

    // Example: Set up export functionality
    const exportButton = document.querySelector("button.btn-primary")
    if (exportButton) {
        exportButton.addEventListener("click", () => {
            exportTransactions()
        })
    }

    // Example: Set up search functionality
    const searchInput = document.querySelector('input[placeholder="Search transactions..."]')
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTransactions(e.target.value)
        })
    }

    // Example: Set up status filter
    const statusFilter = document.querySelector("select")
    if (statusFilter) {
        statusFilter.addEventListener("change", (e) => {
            filterTransactionsByStatus(e.target.value)
        })
    }
})

// Function to export transactions to CSV
function exportTransactions() {
    // Get the Alpine.js component data
    if (typeof Alpine === "undefined" || !Alpine.store) {
        console.error("Alpine.js is not initialized or the store is not available.")
        return
    }

    const component = Alpine.store("transactionsPage")
    if (!component) return

    const transactions = component.transactions

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "ID,Customer,Email,Amount,Date,Status\n"

    transactions.forEach((transaction) => {
        csvContent += `${transaction.id},${transaction.customer},${transaction.email},₦${transaction.amount},${transaction.date},${transaction.status}\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "neps-qr-transactions.csv")
    document.body.appendChild(link)

    // Trigger download
    link.click()

    // Clean up
    document.body.removeChild(link)
}

// Function to search transactions
function searchTransactions(query) {
    // This would typically filter the transactions based on the search query
    // For demonstration purposes, we'll just log the query
    console.log("Searching for:", query)

    // In a real implementation, you would update the Alpine.js component data
    // to filter the transactions based on the search query
}

// Function to filter transactions by status
function filterTransactionsByStatus(status) {
    // This would typically filter the transactions based on the selected status
    // For demonstration purposes, we'll just log the status
    console.log("Filtering by status:", status)

    // In a real implementation, you would update the Alpine.js component data
    // to filter the transactions based on the selected status
}

// Function to generate a PDF receipt for a transaction
function generateReceipt(transaction) {
    // This would typically generate a PDF receipt for the transaction
    // For demonstration purposes, we'll just log the transaction
    console.log("Generating receipt for transaction:", transaction)

    // In a real implementation, you would use a library like jsPDF to generate
    // a PDF receipt and trigger a download
}
  
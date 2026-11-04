# BookBridge – Community Book Donation & Marketplace Platform

> *"Every Book Deserves Another Reader."*

BookBridge is a modern, community-based web platform that connects people who have unused books with people who need them. Users can donate books for free, sell gently read books at a fixed price, or negotiate prices through a real-time offer and counteroffer system.

---

## 🌟 Key Features

1. **Book Donations (100% Free)**:
   - List pre-loved books as **FREE Donations** for students and community members.
   - Automatic `FREE` badges and status tracking.
   - When a donation request is accepted, the book is automatically marked as **Reserved**.

2. **Second-Hand Book Marketplace**:
   - **Fixed Price**: Set an asking price in INR; buyers send direct purchase requests.
   - **Open to Offers**: Enable buyer price negotiation.

3. **Interactive Price Negotiation System**:
   - Buyers can make price offers below the asking price.
   - Sellers can accept, decline, or propose counteroffers.
   - Complete negotiation history with timestamps, offer amounts, notes, and role labels.
   - Upon agreement, the offer is marked **Accepted** and the book is automatically set to **Reserved**.

4. **Book Request & Exchange Management**:
   - Track **Incoming Requests** (requests on your books) and **Outgoing Requests** (books you asked for).
   - Real-time status updates: `Pending`, `Accepted`, `Rejected`, `Cancelled`, `Completed`.
   - Built-in prevention against requesting one's own books.

5. **Personalized Dashboard & Bookshelf**:
   - 6 Key Metrics: Total Listed Books, Donated Books, Books For Sale, Incoming Requests, Outgoing Requests, Successful Exchanges.
   - Bookshelf management: Inline editing of book details, deletion with confirmation dialog, and availability status selector (`Available`, `Reserved`, `Donated`, `Sold`).

6. **Exploration & Filtering**:
   - Search by book title or author name.
   - Multi-faceted filtering by Category (Fiction, Self-help, Programming, Technology, Business, Science, Academic, Biography).
   - Filter by condition (`Like New`, `Good`, `Acceptable`) and type (`Donation / Free`, `Fixed Price`, `Open to Offers`).
   - Sort by Newest, Price (Low to High, High to Low), or Title (A to Z).

7. **Wishlist**:
   - Save books with one click from any card or book details page.
   - Persistent in LocalStorage.

8. **Frontend Authentication & Seamless Demo Account Switcher**:
   - Switch between demo accounts with 1 click in the Navbar to test buyer and seller workflows simultaneously.

---

## 👥 Preloaded Demo Accounts

All three demo accounts share the same password:

| Name | Email | Password | Role / City |
| :--- | :--- | :--- | :--- |
| **Tushar Sharma** | `tushar@example.com` | `password123` | Bengaluru, Karnataka |
| **Rahul Verma** | `rahul@example.com` | `password123` | Delhi NCR |
| **Priya Patel** | `priya@example.com` | `password123` | Mumbai, Maharashtra |

> **Pro Tip**: Use the **Account Switcher** pill in the top-right navigation bar to instantly switch between Tushar, Rahul, and Priya. Test sending an offer as Rahul on Tushar's book (*Atomic Habits*), then switch to Tushar to accept or counteroffer!

---

## 🛠️ Technology Stack

- **Framework**: React.js 18 (ES6+ JavaScript)
- **Tooling & Bundler**: Vite 5
- **Routing**: React Router DOM (v6)
- **State Management**: React Context API (`AuthContext`, `BookContext`, `ToastContext`)
- **Data Persistence**: Browser `LocalStorage` (with seed initialization and reset options)
- **Icons**: Lucide React
- **Styling**: Pure CSS3 with Custom Variables and Warm Bookstore Aesthetic (No Tailwind CSS, No external backend)

---

## 🎨 Color Palette

| Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Background** | `#F7F5EF` | Warm bookstore cream background |
| **Primary** | `#254D3D` | Forest green primary brand color |
| **Light Green** | `#DCE9DD` | Soft herbal green for accents and pills |
| **Accent / Gold** | `#D6A66A` | Warm literary amber / gold |
| **Cards & Surfaces** | `#FFFFFF` | Crisp white cards |
| **Text Primary** | `#292929` | Deep charcoal for readability |
| **Text Secondary**| `#777777` | Muted subtitle text |
| **Borders** | `#E8E5DC` | Soft cream borders |

---

## 📁 Project Folder Structure

```
BookBridge/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.jsx              # React DOM mounting & styles import
│   ├── App.jsx               # Routes setup & Context Providers
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar with 1-click user switcher
│   │   ├── Footer.jsx        # Footer with reset demo data button
│   │   ├── BookCard.jsx      # Reusable book card with SVG fallback
│   │   ├── SearchBar.jsx     # Search component with quick clear
│   │   ├── FilterPanel.jsx   # Multi-category, type & condition filters
│   │   └── Modal.jsx         # Accessible modal dialog
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication & account switching
│   │   ├── BookContext.jsx   # Books, requests, offers, wishlist state
│   │   └── ToastContext.jsx  # Notification toasts
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with stats & categories
│   │   ├── ExploreBooks.jsx  # Search, filter & book catalog
│   │   ├── BookDetails.jsx   # Full book showcase & request/offer actions
│   │   ├── DonateBook.jsx    # Book donation form
│   │   ├── SellBook.jsx      # Book sale form (Fixed Price / Open to Offers)
│   │   ├── Dashboard.jsx     # Key metrics & quick exchange management
│   │   ├── MyBookshelf.jsx   # Inventory management, edit & availability
│   │   ├── Requests.jsx      # Incoming & outgoing request tracking
│   │   ├── Negotiations.jsx  # Price offer & counteroffer chat thread
│   │   ├── Wishlist.jsx      # Saved books collection
│   │   ├── Login.jsx         # Login with 1-click demo buttons
│   │   ├── Register.jsx      # New reader signup
│   │   ├── Profile.jsx       # User profile details & listed books
│   │   └── NotFound.jsx      # 404 missing shelf page
│   ├── styles/
│   │   ├── global.css        # CSS variables, typography & layout
│   │   └── components.css    # Cards, tables, modals, badges, hero
│   └── utils/
│       ├── helpers.js        # Formatting, currency, image conversion, SVG fallback
│       ├── seedData.js       # Preloaded users, books, requests & offers
│       └── storage.js        # LocalStorage persistence helpers
```

---

## 🚀 Installation & Running Locally

1. **Extract the ZIP archive**:
   Extract `BookBridge_Project.zip` to your preferred folder.

2. **Open a terminal in the project directory**:
   ```bash
   cd BookBridge
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in your browser**:
   Navigate to `http://localhost:3000` (or the port indicated by Vite).

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🧪 Testing Buyer & Seller Workflows

1. **Negotiation Demo**:
   - Currently, user **Rahul** has made an offer of ₹150 for **Tushar**'s *Atomic Habits* (listed at ₹250), and Tushar counteroffered ₹200.
   - Switch to **Rahul** using the Navbar switcher -> Go to **Offers** (`/negotiations`).
   - Click **Accept ₹200**. Notice the deal is marked **Accepted** and the book is updated to **Reserved**!
   - Switch back to **Tushar** -> Visit **Dashboard** and **My Bookshelf** to see the updated status.

2. **Donation Demo**:
   - Switch to **Priya** -> Go to **Donate** (`/donate`).
   - Fill in a new book title (e.g. *The Little Prince*), upload a cover or pick a curated sample, and click **Complete Book Donation**.
   - Notice the book immediately appears in **Explore Books** with a `FREE` badge and in Priya's **Bookshelf**.
   - Switch to **Tushar** -> Find Priya's new book -> Click **Request Free Book**.
   - Switch back to **Priya** -> Check **Requests** (`/requests`) -> Click **Accept Request**.
   - The book is automatically marked as **Reserved**!

3. **Resetting Data**:
   - Click the **Reset Demo Data** button in the footer at any time to restore the initial state.

---

© 2026 BookBridge. Crafted with ❤️ for book lovers everywhere.


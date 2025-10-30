# Designers Page Update Instructions

## File to Update
`src/app/dashboard/designers/page.js`

## Changes Needed

### 1. Add New Imports (at the top, after existing imports)
```javascript
import { Ban, Trash2, Shield } from "lucide-react";
import BlockDeleteDesignerModal from "../../../components/dashboard/BlockDeleteDesignerModal";
```

### 2. Add New State Variables (in DesignersContent component, after existing useState declarations around line 27)
```javascript
const [blockModalOpen, setBlockModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedDesigner, setSelectedDesigner] = useState(null);
const [actionSuccess, setActionSuccess] = useState(null);
```

### 3. Add Handler Functions (after the viewDesigner function, around line 71)
```javascript
const handleBlockClick = (designer) => {
  setSelectedDesigner(designer);
  setBlockModalOpen(true);
};

const handleDeleteClick = (designer) => {
  setSelectedDesigner(designer);
  setDeleteModalOpen(true);
};

const handleActionSuccess = (data) => {
  setActionSuccess({
    type: blockModalOpen ? 'block' : 'delete',
    message: data.message,
  });

  // Refresh the designers list
  fetchDesigners();

  // Clear success message after 5 seconds
  setTimeout(() => setActionSuccess(null), 5000);
};
```

### 4. Update the Designer Card Actions Section
Replace the existing button section (around lines 269-277) with:

```javascript
<div className="flex items-center space-x-2 ml-4">
  <button
    onClick={() => viewDesigner(designer._id)}
    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
  >
    <CheckCircle className="w-4 h-4 mr-2" />
    View
  </button>

  {designer.isApproved && (
    <>
      <button
        onClick={() => handleBlockClick(designer)}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
        title="Block this designer and their credentials"
      >
        <Ban className="w-4 h-4 mr-2" />
        Block
      </button>

      <button
        onClick={() => handleDeleteClick(designer)}
        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors cursor-pointer"
        title="Delete this designer account"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </button>
    </>
  )}
</div>
```

### 5. Add Success Message Display (after the header section, around line 166, before the stats cards)
```javascript
{/* Success Message */}
{actionSuccess && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center">
      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
      <p className="text-green-700">
        <strong>Success:</strong> {actionSuccess.message}
      </p>
    </div>
  </div>
)}
```

### 6. Add Modals (at the end of the return statement, before the closing </div>, around line 284)
```javascript
      {/* Block/Delete Modals */}
      <BlockDeleteDesignerModal
        isOpen={blockModalOpen}
        onClose={() => {
          setBlockModalOpen(false);
          setSelectedDesigner(null);
        }}
        designer={selectedDesigner}
        actionType="block"
        onSuccess={handleActionSuccess}
      />

      <BlockDeleteDesignerModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDesigner(null);
        }}
        designer={selectedDesigner}
        actionType="delete"
        onSuccess={handleActionSuccess}
      />
    </div>
```

## What These Changes Do

1. **New Imports**: Adds icons and the modal component
2. **State Management**: Tracks which modal is open and which designer is selected
3. **Handler Functions**:
   - Open block/delete modals
   - Handle successful operations
   - Refresh the list after actions
4. **UI Updates**:
   - Adds Block and Delete buttons for approved designers only
   - Shows success messages after operations
   - Displays modals for confirmation
5. **Modals**: Block and Delete modals for safe account management

## Visual Changes

- Approved designers will now have **Block** and **Delete** buttons next to the View button
- Block button is red (destructive action - blocks credentials permanently)
- Delete button is orange (removes account but allows re-registration)
- Clicking either button opens a modal requiring a reason
- Success messages appear at the top of the page after successful actions

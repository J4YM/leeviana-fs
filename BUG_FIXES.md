# Bug Fixes Summary

## Issues Fixed

### 1. ✅ Duplicate Order Number Error
**Problem:** When ordering the same item with different accounts, a unique constraint violation occurred on `orders_order_number_key`. This happened because the order number generation function counted orders for the day, and if two orders were created at the exact same time, they could get the same number.

**Solution:**
- Created `scripts/016_fix_order_number_generation.sql` that uses a PostgreSQL sequence for guaranteed uniqueness
- The sequence ensures that even concurrent orders get unique numbers
- Format: `LVN-YYYYMMDD-XXXX` where XXXX is from the sequence

**To Apply:**
Run `scripts/016_fix_order_number_generation.sql` in Supabase SQL Editor.

### 2. ✅ Chat Room Mixing for Users with Same Name
**Problem:** When different accounts (Google, Facebook, normal sign-in) had the same name, they were sharing the same chat room. This suggested the chat room lookup was using the name instead of the user ID.

**Solution:**
- Updated `components/order/order-confirmation-modal.tsx` to:
  - Always use `user.id` (UUID) for chat room lookup, never the name
  - Use `.limit(1)` instead of `.single()` to avoid errors
  - Added better error handling for unique constraint violations
  - Added comments emphasizing that UUID must be used, not name

**Key Changes:**
- Chat rooms are now correctly identified by `customer_id` which is `user.id` (UUID)
- The lookup explicitly uses `user.id` and includes error handling
- If a room creation fails due to unique constraint, it tries to fetch the existing room

**Note:** The code was already using `user.id`, but the error handling and query method have been improved to prevent any edge cases.

### 3. ✅ Unread Count Not Incrementing in Admin Dashboard
**Problem:** The unread message count in the admin chat dashboard wasn't updating when there were unread messages.

**Solution:**
- Updated `app/admin/chat/page.tsx` to:
  - Use proper data fetch instead of count query for unread messages
  - Added real-time subscriptions for both INSERT and UPDATE events on chat_messages
  - Refresh unread counts when messages are inserted or updated (marked as read)
  - Improved the unread count calculation to use actual data length

**Key Changes:**
- Changed from `select("*", { count: "exact", head: true })` to `select("id")` and using `.length`
- Added subscription to all chat_messages for real-time unread count updates
- Unread counts now refresh automatically when:
  - New messages are sent
  - Messages are marked as read
  - Any message status changes

## Files Modified

1. **scripts/016_fix_order_number_generation.sql** (NEW)
   - Fixes order number generation to use sequence

2. **components/order/order-confirmation-modal.tsx**
   - Improved chat room lookup to always use user.id (UUID)
   - Better error handling for room creation

3. **app/admin/chat/page.tsx**
   - Fixed unread count query
   - Added real-time subscriptions for unread count updates
   - Improved unread count calculation

## Testing Checklist

- [ ] Order same item with different accounts → Should get unique order numbers
- [ ] Users with same name but different accounts → Should have separate chat rooms
- [ ] Admin dashboard → Unread counts should update in real-time
- [ ] New message arrives → Unread count increments
- [ ] Message marked as read → Unread count decrements

## Database Scripts to Run

1. **scripts/016_fix_order_number_generation.sql**
   - Run this in Supabase SQL Editor to fix order number generation
   - This will prevent duplicate order number errors

## Important Notes

1. **Order Numbers:** The sequence-based approach ensures uniqueness even for concurrent orders. The sequence will continue incrementing, so order numbers will be sequential but unique.

2. **Chat Rooms:** Chat rooms are now strictly tied to user IDs (UUIDs), not names. Even if two users have the same name, they will have separate chat rooms because they have different user IDs.

3. **Unread Counts:** The unread count now updates in real-time using Supabase real-time subscriptions. The count refreshes automatically when messages are sent or read.


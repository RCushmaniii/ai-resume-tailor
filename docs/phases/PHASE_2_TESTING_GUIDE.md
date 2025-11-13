# Phase 2 Testing Guide

## How to Access the Analyze Page

1. **Start the development server:**
   ```bash
   cd client
   pnpm dev
   ```

2. **Navigate to the Analyze page:**
   - Open your browser to: `http://localhost:3000/analyze`
   - Or click on the "Analyze" link in the navigation (if added to Header)

## Test Scenarios

### 1. Empty State Test
**Goal:** Verify button is disabled when fields are empty

**Steps:**
1. Load the `/analyze` page
2. Observe the "Analyze Match" button

**Expected:**
- ✅ Button should be disabled (grayed out)
- ✅ Button should not be clickable

### 2. Partial Input Test
**Goal:** Verify button stays disabled with only one field filled

**Steps:**
1. Type text in the Resume textarea only
2. Observe the button

**Expected:**
- ✅ Button should still be disabled

**Steps:**
1. Clear the Resume textarea
2. Type text in the Job Description textarea only
3. Observe the button

**Expected:**
- ✅ Button should still be disabled

### 3. Happy Path Test
**Goal:** Verify the complete analysis flow works

**Sample Resume Text:**
```
John Doe
Senior Software Engineer

EXPERIENCE
- 5+ years developing Python applications
- Built RESTful APIs with Flask and Django
- Worked with PostgreSQL and MongoDB databases
- Implemented CI/CD pipelines with GitHub Actions
- Led team of 3 developers

SKILLS
Python, Flask, Django, JavaScript, React, SQL, Git, Docker, Agile
```

**Sample Job Description:**
```
Senior Backend Engineer

Requirements:
- 5+ years Python development experience
- Strong knowledge of Django or Flask
- Experience with AWS cloud services
- Docker and Kubernetes experience
- SQL database expertise
- Team leadership experience

Nice to have:
- GraphQL experience
- Microservices architecture
- Message queuing (RabbitMQ, Kafka)
```

**Steps:**
1. Paste the sample resume in the Resume textarea
2. Paste the sample job description in the Job Description textarea
3. Observe the button becomes enabled
4. Click "Analyze Match"

**Expected:**
- ✅ Button becomes enabled when both fields have text
- ✅ Loading state appears immediately after clicking
- ✅ "Analyzing your resume..." message displays
- ✅ Skeleton cards show with pulse animation
- ✅ Inputs become grayed out but still visible
- ✅ After ~2.5 seconds, results appear:
  - Large score (82%)
  - "Excellent Match" badge in green
  - Three progress bars (Keywords, Semantic, Tone)
  - Missing keywords with colored badges
  - List of suggestions
- ✅ "Analyze Again" button appears at bottom

### 4. Re-analyze Test
**Goal:** Verify the "Analyze Again" functionality

**Steps:**
1. Complete a full analysis (see Happy Path Test)
2. Click "Analyze Again" button

**Expected:**
- ✅ Results disappear
- ✅ Inputs remain filled with previous text
- ✅ Inputs are no longer grayed out
- ✅ Focus moves to the Resume textarea
- ✅ Page scrolls to top smoothly
- ✅ "Analyze Match" button is enabled (since fields still have text)

### 5. Character Count Test
**Goal:** Verify character counters work

**Steps:**
1. Type in the Resume textarea
2. Observe the character count below the textarea

**Expected:**
- ✅ Character count updates in real-time
- ✅ Shows "X characters" format

### 6. Mobile Responsive Test
**Goal:** Verify layout adapts to mobile screens

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" or similar mobile device
4. Navigate to `/analyze`

**Expected:**
- ✅ Textareas stack vertically (one on top of the other)
- ✅ Button is full-width
- ✅ All text is readable
- ✅ No horizontal scrolling
- ✅ Results cards stack nicely

**Steps:**
1. Resize to tablet width (768px)
2. Observe layout

**Expected:**
- ✅ Textareas remain stacked or go side-by-side (depending on space)
- ✅ Everything remains readable

**Steps:**
1. Resize to desktop width (1280px)
2. Observe layout

**Expected:**
- ✅ Textareas are side-by-side
- ✅ Button is auto-width (not full-width)
- ✅ Content is centered with max-width

### 7. Keyboard Navigation Test
**Goal:** Verify keyboard accessibility

**Steps:**
1. Load `/analyze` page
2. Press Tab key repeatedly

**Expected:**
- ✅ Focus moves through elements in logical order:
  1. Resume textarea
  2. Job Description textarea
  3. Analyze Match button
- ✅ Focus indicators are clearly visible (blue outline)
- ✅ Can type in textareas when focused

**Steps:**
1. Fill both textareas
2. Tab to the button
3. Press Enter key

**Expected:**
- ✅ Analysis starts (same as clicking with mouse)

### 8. Animation Test
**Goal:** Verify smooth animations

**Steps:**
1. Complete an analysis
2. Observe the results appearing

**Expected:**
- ✅ Results fade in smoothly
- ✅ Each card appears with a slight delay (staggered)
- ✅ Scroll to results is smooth (not instant jump)

**Steps:**
1. Click "Analyze Again"

**Expected:**
- ✅ Results fade out smoothly
- ✅ Scroll to top is smooth

### 9. Missing Keywords Badge Colors Test
**Goal:** Verify priority colors are correct

**Expected in Results:**
- ✅ HIGH priority keywords: Red background
- ✅ MEDIUM priority keywords: Yellow/default background
- ✅ LOW priority keywords: Gray background
- ✅ Each badge shows priority label: [HIGH], [MED], [LOW]

### 10. Score Display Test
**Goal:** Verify score displays correctly

**Expected:**
- ✅ Large number (82) in appropriate color
- ✅ Percent sign (%) smaller than number
- ✅ Badge below with text:
  - Score ≥80: "Excellent Match" (green)
  - Score 60-79: "Good Match" (yellow)
  - Score <60: "Needs Improvement" (red)
- ✅ Circular progress indicator matches score

## Common Issues to Watch For

### Issue: Button doesn't enable
**Check:**
- Both textareas have text (not just whitespace)
- No console errors

### Issue: Loading state doesn't appear
**Check:**
- Console for errors
- Network tab for failed requests (shouldn't be any - it's mock data)

### Issue: Results don't appear after loading
**Check:**
- Console for errors
- Verify 2.5 seconds have passed

### Issue: Layout broken on mobile
**Check:**
- Tailwind classes are correct
- No fixed widths preventing responsiveness

### Issue: Animations don't work
**Check:**
- Tailwind animation classes are included
- Browser supports CSS animations

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance Checks

- ✅ Page loads quickly (<1 second)
- ✅ Typing in textareas is responsive (no lag)
- ✅ Animations are smooth (60fps)
- ✅ No console errors or warnings

## Next Steps After Testing

Once all tests pass:
1. Get user feedback on the UI/UX
2. Make any necessary adjustments
3. Proceed to Phase 3: API Integration

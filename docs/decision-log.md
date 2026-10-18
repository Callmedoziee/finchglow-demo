# Decision log

Three decisions where I had to give something up.

## 1. Show saved alerts when the network fails

**Problem.** Staff on weak signal still need to know about an outage. When a refresh fails, the portal has the last alerts saved on the device, but they may be out of date.

**Options.** Show the saved alerts, labelled as saved. Hide them because they might be stale. Show only an error.

**Chosen.** Show the saved copy with the time it was saved and a notice that the refresh failed. During a retry the saved copy stays on screen, so the page never goes blank.

**Cost.** An alert may already be resolved, so someone could act on old information. The label and timestamp reduce that risk but do not remove it. Hiding the alert risks the worse mistake: not knowing payments are down.

**Would change if** alerts carried an expiry or a "resolved" status from the server. I would then drop the ones that are certainly over.

## 2. Settle the alerts before drawing the rest of the page

**Problem.** The alerts arrive a moment after the rest of the page. A critical alert is inserted at the top and pushes everything down. Lighthouse measured a layout shift of 0.603, where under 0.1 is good. A link can move just as someone taps it, which is the worst moment for it.

**Options.** Let the page jump. Reserve blank space for the alert. Wait for the alerts, then draw the page.

**Chosen.** Wait, showing "Loading your portal...", then draw everything at once. The apps load at the same moment as the alerts, so waiting for both costs nothing extra, and the apps would otherwise arrive late and push the page down too. The wait is capped at 1.5 seconds so a slow alerts service cannot hold the whole page, and it only applies to the first load. Layout shift fell from 0.603 to 0.

**Cost.** Up to 1.5 seconds before the launcher appears, even on days with no alerts. The 1.5 seconds is a judgement, not a measured value. I did not reserve blank space because I cannot know the height in advance: there may be no alert, one, or several.

**Would change if** the alerts arrived inside the first response from the server, so there was nothing to wait for. Or if real measurements showed the alerts service is usually slow, I would lower the limit.

## 3. Offline-friendly behaviour as the extra feature

**Problem.** The brief asks for one extra from four: offline behaviour, dark mode, role-based views, or a component library with tokens.

**Options.** Dark mode helps night shifts but needs a second version of every brand colour, and it does not touch the brief's hardest scenario. Role-based views do not touch it either. The component library overlapped with the re-theming already built.

**Chosen.** Offline behaviour. The hardest question in the brief is a payment-failure alert reaching staff on phones with poor signal, and saved copies are the part of the answer I could build and demonstrate honestly.

**Cost.** It is the riskiest to finish, and it is not a full offline app. With no service worker, a device that never loaded the page has nothing to show. Saved data on a shared tablet could belong to the previous person. The prototype covers this for a device marked as shared (`?device=shared`): it signs the person out after inactivity, with a warning first, and removes the saved copies.

**Would change if** the brief had stressed night shifts (dark mode) or many job types (role-based views). With more time, a service worker comes first.

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { Toaster } from './components/ui/sonner';
// import { ApiStatus } from './components/ApiStatus';

// // Auth
// import Login from './app/page';
// import Register from './app/register/page';
// import ForgotPassword from './app/forgot-password/page';

// // Dashboard Layout & Pages
// import DashboardLayout from './app/(dashboard)/layout';
// import Dashboard from './app/(dashboard)/dashboard/page';
// import Releases from './app/(dashboard)/releases/page';
// import NewRelease from './app/(dashboard)/releases/new/page';
// import Asset from "./app/(dashboard)/asset/page";
// import NewAsset from "./app/(dashboard)/asset/new/page";
// import Artists from './app/(dashboard)/artists/page';
// import NewArtist from './app/(dashboard)/artists/new/page';
// import Tracks from './app/(dashboard)/tracks/page';
// import NewTrack from './app/(dashboard)/tracks/new/page';
// import Videos from './app/(dashboard)/videos/page';
// import NewVideo from './app/(dashboard)/videos/new/page';
// import Performers from './app/(dashboard)/performers/page';
// import NewPerformer from './app/(dashboard)/performers/new/page';
// import Producers from './app/(dashboard)/producers/page';
// import NewProducer from './app/(dashboard)/producers/new/page';
// import Writers from './app/(dashboard)/writers/page';
// import NewWriter from './app/(dashboard)/writers/new/page';
// import Publishers from './app/(dashboard)/publishers/page';
// import NewPublisher from './app/(dashboard)/publishers/new/page';
// import Labels from './app/(dashboard)/labels/page';
// import NewLabel from './app/(dashboard)/labels/new/page';
// import Royalties from './app/(dashboard)/royalties/page';
// import Payouts from './app/(dashboard)/payouts/page';
// import NewPayout from './app/(dashboard)/payouts/new/page';
// import Settings from './app/(dashboard)/settings/page';
// import ReleaseDetails from "./components/ReleaseDetails";

// export default function App() {
//   return (
//     <HelmetProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Auth Routes */}
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//            <Route path="/releases/:id" element={<ReleaseDetails />} />
//           {/* Dashboard Routes */}
//           <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
//           <Route path="/releases" element={<DashboardLayout><Releases /></DashboardLayout>} />
//           <Route path="/releases/new" element={<DashboardLayout><NewRelease /></DashboardLayout>} />
//           {/* <Route path="/assets" element={<DashboardLayout><Asset /></DashboardLayout>} />
//           <Route path="/assets/new" element={<DashboardLayout><NewAsset /></DashboardLayout>} /> */}
//           <Route path="/artists" element={<DashboardLayout><Artists /></DashboardLayout>} />
//           <Route path="/artists/new" element={<DashboardLayout><NewArtist /></DashboardLayout>} />
//           <Route path="/tracks" element={<DashboardLayout><Tracks /></DashboardLayout>} />
//           <Route path="/tracks/new" element={<DashboardLayout><NewTrack /></DashboardLayout>} />
//           <Route path="/videos" element={<DashboardLayout><Videos /></DashboardLayout>} />
//           <Route path="/videos/new" element={<DashboardLayout><NewVideo /></DashboardLayout>} />
//           <Route path="/performers" element={<DashboardLayout><Performers /></DashboardLayout>} />
//           <Route path="/performers/new" element={<DashboardLayout><NewPerformer /></DashboardLayout>} />
//           <Route path="/producers" element={<DashboardLayout><Producers /></DashboardLayout>} />
//           <Route path="/producers/new" element={<DashboardLayout><NewProducer /></DashboardLayout>} />
//           <Route path="/writers" element={<DashboardLayout><Writers /></DashboardLayout>} />
//           <Route path="/writers/new" element={<DashboardLayout><NewWriter /></DashboardLayout>} />
//           <Route path="/publishers" element={<DashboardLayout><Publishers /></DashboardLayout>} />
//           <Route path="/publishers/new" element={<DashboardLayout><NewPublisher /></DashboardLayout>} />
//           <Route path="/labels" element={<DashboardLayout><Labels /></DashboardLayout>} />
//           <Route path="/labels/new" element={<DashboardLayout><NewLabel /></DashboardLayout>} />
//           <Route path="/royalties" element={<DashboardLayout><Royalties /></DashboardLayout>} />
//           <Route path="/payouts" element={<DashboardLayout><Payouts /></DashboardLayout>} />
//           <Route path="/payouts/new" element={<DashboardLayout><NewPayout /></DashboardLayout>} />
//           <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          
//           {/* Catch all */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         <Toaster position="top-right" />
//         <ApiStatus />
//       </BrowserRouter>
//     </HelmetProvider>
//   );
// }




// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from './components/ui/sonner';
import { ApiStatus } from './components/ApiStatus';

// Auth
import Login from './app/page';                  // src/app/page.jsx
import Register from './app/register/page';      // src/app/register/page.jsx
import ForgotPassword from './app/forgot-password/page';

// Dashboard Layout & Pages
import DashboardLayout from './app/(dashboard)/layout';
import Dashboard from './app/(dashboard)/dashboard/page';
import Releases from './app/(dashboard)/releases/page';
import NewRelease from './app/(dashboard)/releases/new/page';
import Asset from "./app/(dashboard)/asset/page";
import NewAsset from "./app/(dashboard)/asset/new/page";
import Artists from './app/(dashboard)/artists/page';
import NewArtist from './app/(dashboard)/artists/new/page';
import Tracks from './app/(dashboard)/tracks/page';
import NewTrack from './app/(dashboard)/tracks/new/page';
import Videos from './app/(dashboard)/videos/page';
import NewVideo from './app/(dashboard)/videos/new/page';
import Performers from './app/(dashboard)/performers/page';
import NewPerformer from './app/(dashboard)/performers/new/page';
import Producers from './app/(dashboard)/producers/page';
import NewProducer from './app/(dashboard)/producers/new/page';
import Writers from './app/(dashboard)/writers/page';
import NewWriter from './app/(dashboard)/writers/new/page';
import Publishers from './app/(dashboard)/publishers/page';
import NewPublisher from './app/(dashboard)/publishers/new/page';
import Labels from './app/(dashboard)/labels/page';
import NewLabel from './app/(dashboard)/labels/new/page';
import Royalties from './app/(dashboard)/royalties/page';
import Payouts from './app/(dashboard)/payouts/page';
import NewPayout from './app/(dashboard)/payouts/new/page';
import Settings from './app/(dashboard)/settings/page';
import ReleaseDetails from "./components/ReleaseDetails"; // detail component
import ReleaseDetailsLayout from "./app/(dashboard)/releases/[id]/layout";
import Metadata from "./app/(dashboard)/releases/[id]/Metadata";
import Overview from "./app/(dashboard)/releases/[id]/Overview";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Release details route inside DashboardLayout
              so detail page shows the same sidebar/header */}
          {/* <Route
            path="/releases/:id"
            element={
             
                <ReleaseDetails />
             
            }
          /> */}
          <Route path="/releases/:id/*" element={<ReleaseDetailsLayout />}>
            <Route path="overview" element={<Overview />} />
            <Route path="metadata" element={<Metadata />} />
            {/* <Route path="tracks" element={<Tracks />} /> */}
            {/* <Route path="distribution" element={<Distribution />} />
            <Route path="track-splits" element={<TrackSplits />} /> */}

            {/* analytics routing */}
            {/* <Route
              path="analytics/consumption"
              element={<AnalyticsConsumption />}
            />
            <Route
              path="analytics/engagement"
              element={<AnalyticsEngagement />}
            />
            <Route path="analytics/revenue" element={<AnalyticsRevenue />} />
            <Route path="analytics/geo" element={<AnalyticsGeo />} /> */}
          </Route>
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/releases"
            element={
              <DashboardLayout>
                <Releases />
              </DashboardLayout>
            }
          />
          <Route
            path="/releases/new"
            element={
              <DashboardLayout>
                <NewRelease />
              </DashboardLayout>
            }
          />

          {/* Other pages - wrap with layout so sidebar shows */}
          <Route
            path="/artists"
            element={
              <DashboardLayout>
                <Artists />
              </DashboardLayout>
            }
          />
          <Route
            path="/artists/new"
            element={
              <DashboardLayout>
                <NewArtist />
              </DashboardLayout>
            }
          />
          <Route
            path="/tracks"
            element={
              <DashboardLayout>
                <Tracks />
              </DashboardLayout>
            }
          />
          <Route
            path="/tracks/new"
            element={
              <DashboardLayout>
                <NewTrack />
              </DashboardLayout>
            }
          />
          <Route
            path="/videos"
            element={
              <DashboardLayout>
                <Videos />
              </DashboardLayout>
            }
          />
          <Route
            path="/videos/new"
            element={
              <DashboardLayout>
                <NewVideo />
              </DashboardLayout>
            }
          />
          <Route
            path="/performers"
            element={
              <DashboardLayout>
                <Performers />
              </DashboardLayout>
            }
          />
          <Route
            path="/performers/new"
            element={
              <DashboardLayout>
                <NewPerformer />
              </DashboardLayout>
            }
          />
          <Route
            path="/producers"
            element={
              <DashboardLayout>
                <Producers />
              </DashboardLayout>
            }
          />
          <Route
            path="/producers/new"
            element={
              <DashboardLayout>
                <NewProducer />
              </DashboardLayout>
            }
          />
          <Route
            path="/writers"
            element={
              <DashboardLayout>
                <Writers />
              </DashboardLayout>
            }
          />
          <Route
            path="/writers/new"
            element={
              <DashboardLayout>
                <NewWriter />
              </DashboardLayout>
            }
          />
          <Route
            path="/publishers"
            element={
              <DashboardLayout>
                <Publishers />
              </DashboardLayout>
            }
          />
          <Route
            path="/publishers/new"
            element={
              <DashboardLayout>
                <NewPublisher />
              </DashboardLayout>
            }
          />
          <Route
            path="/labels"
            element={
              <DashboardLayout>
                <Labels />
              </DashboardLayout>
            }
          />
          <Route
            path="/labels/new"
            element={
              <DashboardLayout>
                <NewLabel />
              </DashboardLayout>
            }
          />
          <Route
            path="/royalties"
            element={
              <DashboardLayout>
                <Royalties />
              </DashboardLayout>
            }
          />
          <Route
            path="/payouts"
            element={
              <DashboardLayout>
                <Payouts />
              </DashboardLayout>
            }
          />
          <Route
            path="/payouts/new"
            element={
              <DashboardLayout>
                <NewPayout />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
        <ApiStatus />
      </BrowserRouter>
    </HelmetProvider>
  );
}

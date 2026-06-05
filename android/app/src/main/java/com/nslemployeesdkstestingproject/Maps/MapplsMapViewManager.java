package com.nslemployeesdkstestingproject.Maps;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.mappls.sdk.maps.MapView;
import com.mappls.sdk.maps.MapplsMap;
import com.mappls.sdk.maps.MapplsMapOptions;
import com.mappls.sdk.maps.OnMapReadyCallback;
import com.mappls.sdk.maps.camera.CameraPosition;
import com.mappls.sdk.maps.camera.CameraUpdateFactory;
import com.mappls.sdk.maps.geometry.LatLng;
import com.mappls.sdk.maps.location.LocationComponent;
import com.mappls.sdk.maps.location.LocationComponentActivationOptions;
import com.mappls.sdk.maps.location.modes.CameraMode;
import com.mappls.sdk.maps.location.modes.RenderMode;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

public class MapplsMapViewManager extends SimpleViewManager<FrameLayout> implements LifecycleEventListener {

    public static final String REACT_CLASS = "MapplsMapView";
    private MapView mapView;
    private MapplsMap mapplsMap;
    private ReactApplicationContext reactContext;
    private LocationComponent locationComponent;
    private double lastLatitude = 0;
    private double lastLongitude = 0;

    public MapplsMapViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FrameLayout createViewInstance(@NonNull ThemedReactContext context) {
        FrameLayout mapContainer = new FrameLayout(context);

        // Initialize MapView with starting position (e.g., New Delhi)
        mapView = new MapView(context, new MapplsMapOptions()
                .camera(new CameraPosition.Builder()
                        .target(new LatLng(28.6139, 77.2090))
                        .zoom(14)
                        .build()));
        mapView.onCreate(null);
        mapContainer.addView(mapView);

        // Add a floating marker image at the center of the map
        ImageView centerMarker = new ImageView(context);
        centerMarker.setImageResource(android.R.drawable.ic_menu_mylocation);  // You can replace with a custom marker image
        FrameLayout.LayoutParams markerParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
        );
        markerParams.gravity = android.view.Gravity.CENTER;
        centerMarker.setLayoutParams(markerParams);
        mapContainer.addView(centerMarker);

        // Floating button to navigate to the user's location
        ImageButton locationButton = new ImageButton(context);
        locationButton.setImageResource(android.R.drawable.ic_menu_mylocation);
        locationButton.setBackgroundColor(0x80FFFFFF);  // semi-transparent background
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(150, 150);
        params.rightMargin = 30;
        params.bottomMargin = 30;
        params.gravity = android.view.Gravity.BOTTOM | android.view.Gravity.END;
        locationButton.setLayoutParams(params);
        mapContainer.addView(locationButton);

        locationButton.setOnClickListener(v -> moveToUserLocation());

        mapView.getMapAsync(new OnMapReadyCallback() {
            @Override
            public void onMapReady(MapplsMap map) {
                mapplsMap = map;
                enableLocationComponent(context);

                // Listen for when the camera stops moving
                mapplsMap.addOnCameraIdleListener(() -> {
                    LatLng target = mapplsMap.getCameraPosition().target;
                    if (shouldEmitLocation(target)) {
                        sendLocationToReactNative(target);
                    }
                });
            }

            @Override
            public void onMapError(int i, String s) {
                // Handle map loading error here
            }
        });

        return mapContainer;
    }

    private void enableLocationComponent(ThemedReactContext context) {
        if (mapplsMap == null) return;

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        mapplsMap.getStyle(style -> {
            locationComponent = mapplsMap.getLocationComponent();
            LocationComponentActivationOptions locationComponentActivationOptions = LocationComponentActivationOptions.builder(context, style)
                    .useDefaultLocationEngine(true)
                    .build();

            locationComponent.activateLocationComponent(locationComponentActivationOptions);
            locationComponent.setLocationComponentEnabled(true);
            locationComponent.setCameraMode(CameraMode.TRACKING_GPS);
            locationComponent.setRenderMode(RenderMode.COMPASS);
        });
    }

    private void moveToUserLocation() {
        if (locationComponent != null && locationComponent.getLastKnownLocation() != null) {
            Location userLocation = locationComponent.getLastKnownLocation();
            LatLng userLatLng = new LatLng(userLocation.getLatitude(), userLocation.getLongitude());
            mapplsMap.animateCamera(CameraUpdateFactory.newLatLngZoom(userLatLng, 15));
        }
    }

    private void sendLocationToReactNative(LatLng latLng) {
        WritableMap locationData = new WritableNativeMap();
        locationData.putDouble("latitude", latLng.getLatitude());
        locationData.putDouble("longitude", latLng.getLongitude());

        String address = getAddressFromLatLng(latLng);
        locationData.putString("address", address);

        Log.d("MapplsMapViewManager", "Emitting location data: " + locationData);

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onLocationChange", locationData);

        // Update the last known location
        lastLatitude = latLng.getLatitude();
        lastLongitude = latLng.getLongitude();
    }

    private boolean shouldEmitLocation(LatLng newLocation) {
        if (lastLatitude == 0 && lastLongitude == 0) {
            // Initial location set
            return true;
        }
        float[] results = new float[1];
        Location.distanceBetween(lastLatitude, lastLongitude, newLocation.getLatitude(), newLocation.getLongitude(), results);
        return results[0] >= 75;  // Emit if distance is greater than or equal to 75 meters
    }

    private String getAddressFromLatLng(LatLng latLng) {
        Geocoder geocoder = new Geocoder(reactContext, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(latLng.getLatitude(), latLng.getLongitude(), 1);
            if (addresses != null && !addresses.isEmpty()) {
                Address address = addresses.get(0);
                return address.getAddressLine(0);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Unknown Address";
    }

    // Clean up MapView to prevent memory leaks
    @Override
    public void onDropViewInstance(@NonNull FrameLayout view) {
        super.onDropViewInstance(view);
        mapView.onStop();
        mapView.onDestroy();
    }

    // React Native Lifecycle Event Methods
    @Override
    public void onHostResume() {
        if (mapView != null) {
            mapView.onResume();
        }
    }

    @Override
    public void onHostPause() {
        if (mapView != null) {
            mapView.onPause();
        }
    }

    @Override
    public void onHostDestroy() {
        if (mapView != null) {
            mapView.onDestroy();
        }
        reactContext.removeLifecycleEventListener(this);
    }
}

//
//  VinylMapView.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VinylMapView.h"
#import <React/RCTConvert.h>
#import "pingstersApp-Swift.h"

@implementation VinylMapView {
  GMSMapView *_map;
  GMSMarker *_marker;
  NSMutableArray *_markers;
}

- (instancetype)init
{
  self = [super init];
  _markers = [[NSMutableArray alloc] init];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:-33.86
                                                          longitude:120.20
                                                               zoom:6];
  
  _didChangeCameraPositionEnabled = false;
  
  _map = [[GMSMapView alloc] initWithFrame:self.bounds];
  _map = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  _map.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _map.myLocationEnabled = YES;
  _map.delegate = self;
  [self addSubview:_map];

  return self;
}

- (id)eventMapMoved:(BOOL)gesture {
  NSLog(@"sending event map willMove");
  return @{
            @"gesture": @(gesture)
           };
}

- (id)eventFromCoordinate:(CLLocationCoordinate2D)coordinate {
  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           };
}

- (id)eventMarkerPress:(CLLocationCoordinate2D)coordinate type:(NSString *)type nodeId:(NSString*)nodeId {
  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           @"type": type,
           @"id": nodeId,
           };
}

- (id)eventCameraPositionChange:(double) latitude longitude:(double)longitude {
  return @{
           @"latitude": @(latitude),
           @"longitude": @(longitude)
           };
}

- (void)moveMap:(NSString*)latitude longitude:(NSString *)longitude {
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:latitude.doubleValue
                                                          longitude:longitude.doubleValue
                                                               zoom:6];
  _map.camera = camera;
}

- (void)clearMap {
  [_map clear];
}

- (void)animateToLocation:(NSString *)latitude longitude:(NSString *)longitude {
  [_map animateToLocation: CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
}

- (void)animateToLocationWithZoom:(NSString *)latitude longitude:(NSString *)longitude zoom:(float)zoom {
  [_map animateToLocation:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  [_map animateToZoom:zoom];
}

- (void)moveMarker:(NSString *)latitude longitude:(NSString *)longitude {
  if (_marker.map == nil) {
    _marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
    _marker.appearAnimation = kGMSMarkerAnimationPop;
    _marker.map = _map;
  } else {
    _marker.map = nil;
  }
}

- (void)addMarker:(NSString *)latitude longitude:(NSString *)longitude id:(NSString*)id {
  GMSMarker *new_marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  
  new_marker.icon = [GMSMarker markerImageWithColor:[UIColor blackColor]];;
  new_marker.map = _map;
  [_markers addObject:new_marker];
}

- (void)removeMarker:(NSString *)id {
  NSArray *filtered = [_markers filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"(id == %@)", id]];
  NSDictionary *item = [filtered objectAtIndex:0];
  GMSMarker * marker = item[@"marker"];
  if (marker) {
    marker.map = nil;
  }
}

- (void)addMarkerNode:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name nodeId:(NSString *)nodeId {
  GMSMarker *new_marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  NSLog(@"adding node marker with node name: %@ at %.10f %.10f", name, latitude.doubleValue, longitude.doubleValue);
  
  new_marker.iconView = [self getNodeStyleIconView:name];
  new_marker.map = _map;
  
  NSDictionary *dict = @{
                         @"marker": new_marker,
                         @"type": @"node",
                         @"id": nodeId
                         };
  [_markers addObject:dict];
}

- (void)addMarkerDest:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name pUrl:(NSString *)pUrl uId:(NSString *)uId {
  GMSMarker *new_marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  NSLog(@"adding dest marker with user name: %@ at %.10f %.10f", name, latitude.doubleValue, longitude.doubleValue);
  
  new_marker.iconView = [self getNodeStyleIconView:name];
  new_marker.map = _map;
  
  NSDictionary *dict = @{
                         @"marker": new_marker,
                         @"type": @"dest",
                         @"id": uId
                         };
  [_markers addObject:dict];
}

- (UIView *)getNodeStyleIconView: (NSString *)name {
  int nameLabelHeight = 30;
  int triangleHeight = 20;
  int triangleWidth = 8;
  
  UILabel *nodeNameLabel = [[UILabel alloc] init];
  [nodeNameLabel setTextColor:[UIColor whiteColor]];
  [nodeNameLabel setBackgroundColor:[UIColor blackColor]];
  [nodeNameLabel setFont:[UIFont fontWithName:@"Helvetica Bold" size:16]];
  [nodeNameLabel setText:name];
  nodeNameLabel.textAlignment = NSTextAlignmentCenter;
  CGSize textSize = [nodeNameLabel intrinsicContentSize];
  
  int WIDTH = textSize.width + 10;
  
  [nodeNameLabel setFrame:CGRectMake(0, 0, WIDTH, nameLabelHeight)];
  
  // [start draw triangle]
  UIBezierPath* trianglePath = [UIBezierPath bezierPath];
  [trianglePath moveToPoint:CGPointMake(0, 0)];
  [trianglePath addLineToPoint:CGPointMake(triangleWidth/2, triangleHeight)];
  [trianglePath addLineToPoint:CGPointMake(triangleWidth, 0)];
  [trianglePath closePath];
  
  CAShapeLayer *triangleMaskLayer = [CAShapeLayer layer];
  [triangleMaskLayer setPath:trianglePath.CGPath];
  
  UIView *triangleView = [[UIView alloc] initWithFrame:CGRectMake(WIDTH/2 - triangleWidth/2, nameLabelHeight, triangleWidth, triangleHeight)];
  
  triangleView.backgroundColor = [UIColor blackColor];
  triangleView.layer.mask = triangleMaskLayer;
  // [end draw triangle]
  
  UIView *nodeIconView  = [[UIView alloc] initWithFrame:CGRectMake(0, 0, WIDTH, nameLabelHeight+triangleHeight)];
  nodeIconView.backgroundColor = [UIColor clearColor];
  
  [nodeIconView addSubview:nodeNameLabel];
  [nodeIconView addSubview:triangleView];
  
  return nodeIconView;
}

- (void)updateMarker: (NSString *)latitude longitude:(NSString *)longitude {
  if (_marker == nil) {
    _marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
    
    _marker.map = _map;
  } else {
    [CATransaction begin];
    [CATransaction setAnimationDuration:0.3];
    _marker.position = CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue);
    [CATransaction commit];
  }
}

- (void)fitToCoordinates:(nonnull NSArray<VinylMapCoordinate *> *)coordinates
             edgePadding:(nonnull NSDictionary *)edgePadding
                animated:(BOOL)animated
{
  CLLocationCoordinate2D myLocation = coordinates.firstObject.coordinate;
  GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];
  NSLog(@"fitToCoordinates");
  for (VinylMapCoordinate *coordinate in coordinates) {
    bounds = [bounds includingCoordinate:coordinate.coordinate];
  }

  // Set Map viewport
  CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
  CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
  CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
  CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];
  
  [_map animateWithCameraUpdate:[GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)]];
}

- (void)enableDidChangeCameraPosition
{
  // NSLog(@"enabled did change camera position");
  self.didChangeCameraPositionEnabled = true;
}

- (void)disableDidChangeCameraPosition
{
  // NSLog(@"disabled did change camera position");
  self.didChangeCameraPositionEnabled = false;
}

#pragma mark - GMSMapViewDelegate

- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture {
  NSLog(@"map moved with yes");
  if (!self.onMapMove) return;
  self.onMapMove([self eventMapMoved:gesture]);

}

- (void)mapView:(GMSMapView *)mapView idleAtCameraPosition:(GMSCameraPosition *)position {
  NSLog(@"idle");
  double latitude = position.target.latitude;
  double longitude = position.target.longitude;
  
  if (self.didChangeCameraPositionEnabled == true) {
    // send event with lat lon data to JS
    if (!self.onChangeCameraPosition) return;
    self.onChangeCameraPosition([self eventCameraPositionChange:latitude longitude:longitude]);
  }
}

- (void)mapView:(GMSMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onPress) return;
  self.onPress([self eventFromCoordinate:coordinate]);
}

- (BOOL)mapView:(GMSMapView *)mapView didTapMarker:(GMSMarker *)marker {
  NSArray *filtered = [_markers filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"(marker == %@)", marker]];
  NSDictionary *item = [filtered objectAtIndex:0];
  if (self.onMarkerPress) {
    self.onMarkerPress([self eventMarkerPress:marker.position type:item[@"type"] nodeId:item[@"id"]]);
  }
  return YES;
}

- (void)mapView:(GMSMapView *)mapView didChangeCameraPosition:(GMSCameraPosition *)position {
//  double latitude = mapView.camera.target.latitude;
//  double longitude = mapView.camera.target.longitude;
//  
//  if (self.didChangeCameraPositionEnabled == true) {
//    // send event with lat lon data to JS
//    if (!self.onChangeCameraPosition) return;
//    self.onChangeCameraPosition([self eventCameraPositionChange:latitude longitude:longitude]);
//  }
}

@end

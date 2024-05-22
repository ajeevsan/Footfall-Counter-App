import { Component, AfterViewInit, OnInit  } from '@angular/core';
import { fabric } from 'fabric';
import { Control } from 'fabric/fabric-impl';
import { DataTransferService } from '../service/data-transfer.service';


@Component({
  selector: 'app-roi-settings',
  templateUrl: './roi-settings.component.html',
  styleUrls: ['./roi-settings.component.css']
})
export class RoiSettingsComponent implements OnInit  {

  canvas: fabric.Canvas | any;
  polygon: fabric.Polygon| any;
  pointIndex: any;
  canvasWrapperROI: any;

  timeContainer: boolean = false
  arr_spot_roi: any = [];
  arr_rect_roi: any = [];

  time? = new Date();

  imageUrl: any;
  visibleInside: number = 0;
  visibleOutside: number = 0;
  totalEntries: number = 0;
  private dataSubscription: any;

  canvasScalingWidthROI = 0;
  canvasScalingHeightROI = 0;

  constructor(private dataTransferService: DataTransferService) { }

  ngOnInit() {

    this.dataSubscription = this.dataTransferService.data$.subscribe(data => {
      this.imageUrl = `data:image/jpeg;base64,${data.data}`;
      this.visibleInside = data.vis_in;
      this.visibleOutside = data.vis_out;
      this.totalEntries = data.tot_in;
    });

    // var points = [{
    //   x: 100, y: 100
    // }, {
    //   x: 200, y: 100
    // }, {
    //   x: 200, y: 300
    // }, {
    //   x: 100, y: 300
    // },]

    // var polygon = new fabric.Polygon(points, {
    //   left: 1000,
    //   top: 100,
    //   fill: '#98d5453b',
    //   strokeWidth: 1,
    //   stroke: 'red',
    //   scaleX: 4,
    //   scaleY: 4,
    //   objectCaching: false,
    //   transparentCorners: false,
    //   cornerColor: 'blue',
    // });
    // // const group = new fabric.Group([polygon]) as any;
    // // group.id = 'polygon'
    // this.canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
    // this.canvas.add(polygon);

    this.drawROI();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.dataTransferService.closeConnection();
  }

  drawROI() {
    this.canvasROIWindowScaling()
    this.canvasWrapperROI = document.getElementById('canvas-wrapper-roi')
    this.canvas = new fabric.Canvas('canvas-roi',{ selection: false, width: this.canvasWrapperROI.clientWidth, height: this.canvasWrapperROI.clientHeight });

    const originalWidth = 1280;
    const originalHeight = 720;
    const currentWidth = this.canvasWrapperROI.clientWidth;
    const currentHeight = this.canvasWrapperROI.clientHeight;

    const scaleX = currentWidth / originalWidth;
    const scaleY = currentHeight / originalHeight;

    let points = [
      { x: 100 * scaleX, y: 100 * scaleY },
      { x: 200 * scaleX, y: 100 * scaleY },
      { x: 200 * scaleX, y: 300 * scaleY },
      { x: 100 * scaleX, y: 300 * scaleY },
    ];

    let polygon = new fabric.Polygon(points, {
      left: 1000,
      top: 100,
      fill: '#98d5453b',
      strokeWidth: 1,
      stroke: 'red',
      scaleX: 4,
      scaleY: 4,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue',
    });

    this.canvas.clear();
    this.canvas.add(polygon);
    this.canvas.requestRenderAll();
  }

  canvasROIWindowScaling() {
    const canvasROI: HTMLElement = document.getElementById('canvas-roi')!;

    
    let canvasWidth = canvasROI.offsetWidth;
    let canvasHeight = canvasROI.offsetHeight;
    console.log('canvasWidth and canvasHeight', canvasWidth, canvasHeight);

    this.canvasScalingWidthROI = 1280 / canvasWidth;
    this.canvasScalingHeightROI = 720 / canvasHeight;

    console.log('canvasWidth and canvasHeight', this.canvasScalingWidthROI, this.canvasScalingHeightROI);
  }



  onImageLoad(){
    console.log('on image load clicked');
  }

  saveRoi(){
    let roi = this.canvas.getObjects();
    console.log(roi);
    
  }
  

  toggleClock(){
    this.timeContainer = !this.timeContainer
  }

  polygonPositionHandler(dim:any, finalMatrix:any, fabricObject:any) {
    // Function definition here...
    var x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
		    y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
		return fabric.util.transformPoint(
			{
        x: x, y: y,
        type: '',
        add: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        addEquals: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        scalarAdd: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        scalarAddEquals: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        subtract: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        subtractEquals: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        scalarSubtract: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        scalarSubtractEquals: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        multiply: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        multiplyEquals: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        divide: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        divideEquals: function (scalar: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        eq: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        lt: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        lte: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        gt: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        gte: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        lerp: function (that: fabric.IPoint, t: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        distanceFrom: function (that: fabric.IPoint): number {
          throw new Error('Function not implemented.');
        },
        midPointFrom: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        min: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        max: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        setXY: function (x: number, y: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        setX: function (x: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        setY: function (y: number): fabric.Point {
          throw new Error('Function not implemented.');
        },
        setFromPoint: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        swap: function (that: fabric.IPoint): fabric.Point {
          throw new Error('Function not implemented.');
        },
        clone: function (): fabric.Point {
          throw new Error('Function not implemented.');
        }
      },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
		);
  }

  getObjectSizeWithStroke(object:any) {
    // Function definition here...
    var stroke = new fabric.Point(
			object.strokeUniform ? 1 / object.scaleX : 1, 
			object.strokeUniform ? 1 / object.scaleY : 1
		).multiply(object.strokeWidth);
		return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
  }

  actionHandler = (eventData: any, transform: any, x: any, y: any) => {
    // Function definition here...
    var polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
        polygonBaseSize = this.getObjectSizeWithStroke(polygon), // Ensure that this.getObjectSizeWithStroke is correctly bound
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
          x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
          y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
        };        
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
  }

  anchorWrapper(anchorIndex: any, fn: any) {
    return ((eventData:any, transform:any, x:any, y:any) => {
      var fabricObject = transform.target,
          absolutePoint = fabric.util.transformPoint({
            x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
            y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
            type: '',
            add: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            addEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            scalarAdd: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            scalarAddEquals: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            subtract: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            subtractEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            scalarSubtract: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            scalarSubtractEquals: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            multiply: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            multiplyEquals: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            divide: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            divideEquals: function (scalar: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            eq: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            lt: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            lte: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            gt: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            gte: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            lerp: function (that: fabric.IPoint, t: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            distanceFrom: function (that: fabric.IPoint): number {
              throw new Error('Function not implemented.');
            },
            midPointFrom: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            min: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            max: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            setXY: function (x: number, y: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            setX: function (x: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            setY: function (y: number): fabric.Point {
              throw new Error('Function not implemented.');
            },
            setFromPoint: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            swap: function (that: fabric.IPoint): fabric.Point {
              throw new Error('Function not implemented.');
            },
            clone: function (): fabric.Point {
              throw new Error('Function not implemented.');
            }
          }, fabricObject.calcTransformMatrix()),
          actionPerformed = fn(eventData, transform, x, y),
          newDim = fabricObject._setPositionDimensions({}),
          polygonBaseSize = this.getObjectSizeWithStroke(fabricObject),
          newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
  		    newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    })
}

movingRotatingWithinBounds(e: any) {
  const obj = e.target;
  var json
  // if object is too big ignore
  if(obj.height > obj.canvas.height || obj.width > obj.canvas.width){
    return;
  }
  obj.setCoords();
  // top-left  corner
  if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
  }
  // bot-right corner
  if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
  }
  json = this.canvas.toJSON();
  // console.log('rect json',json);
  this.arr_rect_roi[parseInt(this.canvas.getActiveObject().id.substring(4))-1] = [Math.round(this.canvas.getActiveObject().left * this.canvasScalingWidthROI), Math.round(this.canvas.getActiveObject().top * this.canvasScalingHeightROI) ,Math.round(this.canvas.getActiveObject().width * this.canvas.getActiveObject().scaleX * this.canvasScalingWidthROI),Math.round(this.canvas.getActiveObject().height * this.canvas.getActiveObject().scaleY * this.canvasScalingHeightROI)]
}


edit() {
  let poly = this.canvas.getObjects()[0];

  this.canvas.setActiveObject(poly);
  poly.edit = !poly.edit;
  if (poly.edit) {
    var lastControl = poly.points.length - 1;
    poly.cornerStyle = 'circle';
    poly.cornerColor = 'rgba(0,0,255,0.5)';
    poly.controls = poly.points.reduce((acc:any, point:any, index:any) => {
      acc['p' + index] = new fabric.Control({
        positionHandler: this.polygonPositionHandler,
        actionHandler: this.anchorWrapper(index > 0 ? index - 1 : lastControl, this.actionHandler),
        actionName: 'modifyPolygon',
        // Cast to Partial<Control> to resolve TypeScript error
        pointIndex: index
      } as Partial<Control>);
      return acc;
    }, { });
  } else {
    poly.cornerColor = 'blue';
    poly.cornerStyle = 'rect';
    poly.controls = fabric.Object.prototype.controls;
  }
  poly.hasBorders = !poly.edit;
  this.canvas.requestRenderAll();
}

}

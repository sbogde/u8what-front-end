// Central list of available segmentation models and their display labels.
export const modelOptions = [
  { value: "v0.4-Ultralytics-Hub", label: "v0.4 Ultralytics Hub" },
  { value: "v2.1-Ultralytics-Hub", label: "v2.1 Ultralytics Hub" },
  { value: "v0.4-Google-Colab", label: "v0.4 Google Colab" },
  { value: "v2.1-Google-Colab", label: "v2.1 Google Colab" },
  { value: "v0.4-Mici-Google-Colab", label: "Mici! v0.4 Google Colab" },
  // { value: "v0.4_mici_plus3_stageB_epoch_02", label: "Mici, Sarmalex2, Mamaliga v0.4" },
  { value: "v0.4_mici_sarmale_mamaliga", label: "Mici, 2xSarmale, Mamaliga v0.4" },
  { value: "v2.1_plus_yorkshire_pudding_gc", label: "Yorkshire Pudding v2.1 GC" },
  { value: "v2.1_plus_yorkshire_pudding_uhub", label: "Yorkshire Pudding v2.1 UHUB" },
  { value: "yolov8n-seg", label: "yolov8n-seg" },
  { value: "yolov8s-seg", label: "yolov8s-seg" },
  { value: "yolov8m-seg", label: "yolov8m-seg" },
  { value: "yolov8l-seg", label: "yolov8l-seg" },
  { value: "yolov8x-seg", label: "yolov8x-seg" },
];

export const modelLabelMap = modelOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const getModelLabel = (value) => modelLabelMap[value] || value;

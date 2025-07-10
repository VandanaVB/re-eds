on
{
  "definitions": [
    {
      "title": "Open Frame",
      "id": "open-frame",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Open Frame",
              "filter": "open-frame-filter"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "open-frame-model",
      "fields": [
        {
          "component": "image",
          "name": "illustration",
          "label": "Illustration",
          "required": true
        },
        {
          "component": "text",
          "name": "artist",
          "label": "Artist Credit",
          "required": true
        },
        {
          "component": "textarea",
          "name": "description",
          "label": "Description",
          "required": true
        }
      ]
    }
  ],
  "filters": [
    {
      "id": "open-frame-filter",
      "components": [
        "image",
        "text",
        "textarea"
      ]
    }
  ]
}
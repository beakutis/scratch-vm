const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const BLE = require('../../io/ble');
const formatMessage = require('format-message');
const Base64Util = require('../../util/base64-util');
var events = require('events');
var eventEmitter = new events.EventEmitter();

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

//TO DO: Update to Ara Image
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2aW4iIGhlaWdodD0iNmluIiB2aWV3Qm94PSIwIDAgNDMyIDQzMiI+CiAgPHRpdGxlPkFydGJvYXJkIDE8L3RpdGxlPgogIDxnPgogICAgPHBvbHlnb24gcG9pbnRzPSIyNDUuOTkgMzU5Ljc1IDI1OC40NyAzNTkuNzUgMjU4LjQ3IDM2MS42IDI1Ni42MiAzNjEuNiAyNTYuNjIgMzYxLjU3IDI0Ny44NCAzNjEuNTcgMjQ3Ljg0IDM2MS42IDI0NS45OSAzNjEuNiAyNDUuOTkgMzU5Ljc1IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBvbHlnb24gcG9pbnRzPSI3Mi4zMiAyMTcuMTYgNzIuMzIgMzI4LjU5IDcyLjE5IDMyOC41OSA3Mi4xOSAzMTguODQgNzAuNDcgMzE4Ljg0IDcwLjQ3IDIyOS42NCA3Mi4xOSAyMjkuNjQgNzIuMTkgMjE3LjE2IDcyLjMyIDIxNy4xNiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xNjEuNzIsMzAuMjVhNy4yMyw3LjIzLDAsMSwwLTExLjk0LDUuNDZsLjMzLjI4VjU3LjI2aDIxLjcyVjcwLjQzSDE3MFY1OS4xMUgxNDguMjZWMzYuODJhOSw5LDAsMCwxLTIuODQtNi41Nyw5LjA4LDkuMDgsMCwxLDEsMTUuMzIsNi41N3Y5LjgxaDIxLjczdjIzLjhoLTEuODV2LTIySDE1OC44OVYzNmwuMzEtLjI4QTcuMiw3LjIsMCwwLDAsMTYxLjcyLDMwLjI1WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjMxNC4wNyIgeT0iMzU5LjcyIiB3aWR0aD0iMTIuNDgiIGhlaWdodD0iMC4wNCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xNTMuMzYsNDA5YTcuMjMsNy4yMywwLDAsMCw0LjcxLTEyLjdsLS4zMi0uMjdWMzgzLjUyaDIxLjczVjM2MS42aDEuODV2MjMuNzdIMTU5LjZ2OS44MWE5LjA4LDkuMDgsMCwxLDEtMTIuNDgsMFYzNzIuODloMjEuNzNWMzYxLjZoMS44NXYxMy4xNEgxNDlWMzk2bC0uMzMuMjdhNy4yMyw3LjIzLDAsMCwwLDQuNzIsMTIuN1oiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIyMDkuNTkiIHk9IjM2MS41NyIgd2lkdGg9IjguNzgiIGhlaWdodD0iMC4wNCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik03MC40NywxMDMuNDVhMzMsMzMsMCwwLDEsMzEuNDQtMzN2MS44aDEuNTlhMzEuMjEsMzEuMjEsMCwwLDAtMzEuMTgsMzEuMTd2Mi43OUg3MC40N1oiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIzNjEuNjciIHk9IjEwOC43NSIgd2lkdGg9IjAuMDYiIGhlaWdodD0iOC43OCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xNDEuMTgsMjA3LjQ5bC0yLjczLjQxLS4zOC0uNzljLjc4LS4zOCwxLjU0LS43OSwyLjI3LTEuMjIsMTIuMjEtNy4zLDE0LjE3LTExLjg5LDE0LjQ0LTEzLjUzbDIuNzQuNDdjLS41MiwzLjA2LTMuNjcsOC4yMS0xNS43NiwxNS40NGE0LjIzLDQuMjMsMCwwLDEtLjQxLjIzQzE0MS4yNSwyMDcuODcsMTQxLjE5LDIwNy41MiwxNDEuMTgsMjA3LjQ5WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iNzIuMzIgMTA2LjI0IDcyLjMyIDIxNy4xNiA3Mi4xOSAyMTcuMTYgNzAuNDcgMjE3LjE2IDcwLjQ3IDExOC43MiA3Mi4xOSAxMTguNzIgNzIuMTkgMTA2LjI0IDcyLjMyIDEwNi4yNCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yNDMuNzYsMjUwLjEzYTMxLjg4LDMxLjg4LDAsMSwwLTMxLjg5LTMxLjg4QTMxLjkyLDMxLjkyLDAsMCwwLDI0My43NiwyNTAuMTNabTAsMi43N2EzNC42NiwzNC42NiwwLDEsMSwzNC42Ni0zNC42NUEzNC42OSwzNC42OSwwLDAsMSwyNDMuNzYsMjUyLjlaIiBzdHlsZT0iZmlsbDogI2VkMWMyNCIvPgogICAgPHBvbHlnb24gcG9pbnRzPSIyMTguODcgNzAuNDMgMjIwLjcyIDcwLjQzIDIyMC43MiA3Mi4yOCAyMDguMjQgNzIuMjggMjA4LjI0IDcwLjQzIDIxMC4wOSA3MC40MyAyMTguODcgNzAuNDMiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjcwLjcsNDguNDhWMzZsLS4zMS0uMjhhNy4yMyw3LjIzLDAsMSwxLDkuNDIsMGwtLjMyLjI4VjU3LjI2SDI1Ny43NlY3MC40M0gyNDl2LTIyWiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxyZWN0IHg9IjE4Mi40NyIgeT0iNzAuNDMiIHdpZHRoPSIyNS43NyIgaGVpZ2h0PSIxLjg1IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBvbHlnb24gcG9pbnRzPSIxODIuNDcgNzIuMjggMTY5Ljk5IDcyLjI4IDE2OS45OSA3MC40MyAxNzEuODMgNzAuNDMgMTgwLjYyIDcwLjQzIDE4Mi40NyA3MC40MyAxODIuNDcgNzIuMjgiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIzNTkuODIiIHk9IjIxNy41MiIgd2lkdGg9IjAuMDYiIGhlaWdodD0iMTIuNDgiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8Y2lyY2xlIGN4PSIyNDMuMzciIGN5PSIyMTcuODYiIHI9IjYuNyIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yMTQuOTQsMTQxLjM4bC41MiwwLS41MiwwWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0zNTkuODIsMzMwLjQ1VjMxOS41aC4wNXY5LjA5QzM1OS44NywzMjkuMjEsMzU5Ljg1LDMyOS44MywzNTkuODIsMzMwLjQ1WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yNzguMzUsMzk2bC4zMi4yN2E3LjIyLDcuMjIsMCwxLDEtOS40MiwwbC4zMi0uMjdWMzgzLjUySDI0Ny44NFYzNjEuNmg4Ljc4djEzLjE0aDIxLjczWiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxwYXRoIGQ9Ik0yMjQuNDMsMjE4LjYyYTE4LjkyLDE4LjkyLDAsMSwxLDE4LjkxLDE4LjkyQTE4LjkzLDE4LjkzLDAsMCwxLDIyNC40MywyMTguNjJabTkuNDYtLjUyYTkuNDgsOS40OCwwLDEsMCw5LjQ4LTkuNDhBOS40OSw5LjQ5LDAsMCwwLDIzMy44OSwyMTguMVoiIHN0eWxlPSJmaWxsOiAjZjFmMmYyIi8+CiAgICA8cG9seWdvbiBwb2ludHM9IjM2MS42NyAyMjguMTUgMzYxLjcyIDIyOC4xNSAzNjEuNzIgMjI5Ljk5IDM1OS44NyAyMjkuOTkgMzU5Ljg3IDIxNy41MiAzNjEuNzIgMjE3LjUyIDM2MS43MiAyMTkuMzYgMzYxLjY3IDIxOS4zNiAzNjEuNjcgMjI4LjE1IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTIxNy4xOSwyODUuOTJjMCwuMzEtLjA3LjY4LS4wOSwxLjA5YS40NS40NSwwLDAsMS0uMTYsMHYtMS4xNVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjA5LjU5LDM2MS42djM0LjUzbC0uMzEuMjdhNy4yMiw3LjIyLDAsMSwwLDkuNDMtLjI3bC0uMzQtLjI4VjM2MS42aDEuODVWMzk1YTkuMDksOS4wOSwwLDEsMS0xMi40OC4zNFYzNjEuNloiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjA5Ljc0LDM1Ljg3YTcuMjMsNy4yMywwLDEsMSw5LjQzLS4yN2wtLjMuMjdWNzAuNDNoLTguNzhWMzYuMTVaIiBzdHlsZT0iZmlsbDogIzkzOTU5OCIvPgogICAgPHBhdGggZD0iTTExMywzNTkuNzVIMTAzLjVjLS41NCwwLTEuMDgsMC0xLjYsMEgxMTNaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPGNpcmNsZSBjeD0iMTgwLjczIiBjeT0iMjE3Ljg3IiByPSI2LjciIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjYyLjI2LDIxOC42MmExOC45MiwxOC45MiwwLDEsMC0xOC45MiwxOC45MkExOC45NCwxOC45NCwwLDAsMCwyNjIuMjYsMjE4LjYyWm0tNDAuNjEsMGEyMS42OSwyMS42OSwwLDEsMSwyMS42OSwyMS42OUEyMS43MSwyMS43MSwwLDAsMSwyMjEuNjUsMjE4LjYyWiIgc3R5bGU9ImZpbGw6ICNlZDFjMjQiLz4KICAgIDxwYXRoIGQ9Ik0xMDAuNDgsMzk1LjMyVjM2MS40NmMuNjEuMDYsMS4yMy4xLDEuODUuMTJ2MzQuNTVsLS4zLjI3YTcuMjIsNy4yMiwwLDEsMCw5LjQzLS4yN2wtLjM1LS4yOFYzNjEuNkgxMTNWMzk1YTkuMDgsOS4wOCwwLDEsMS0xMi40OC4zNFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMzI4LDcwLjQzaC43MmEzMy4wNiwzMy4wNiwwLDAsMSwzMywzM3YzLjQ1aC0xLjg1di0zLjQ1YTMxLjIxLDMxLjIxLDAsMCwwLTMxLjE4LTMxLjE3SDMyOFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNOTMuNDMsMzQwLjQ5Vjk2LjE2SDMzNy44NFYzNDAuNDlabTE3LjgzLTE3NGMtOC41MywxOS44My0xMiwzMi44NC00LjY2LDQwLjY0LDMuNiwzLjgxLDkuOTQsNi4yMywxNy4xOSw2LjIzYTM0Ljc4LDM0Ljc4LDAsMCwwLDE1LTMuNDdjLjY5LDQsMi40OCwxMy42OSw1LjM3LDI0LjcsNS4xMSwxOS40MiwxMS4wNywzMy41NCwxNy43LDQxLjkzLDE0LjMzLDE4LjExLDIzLjU5LDIzLjQ2LDMyLjU0LDI4LjYzbDMsMS43NGExNy45MSwxNy45MSwwLDAsMCw5LjE4LDIuNzUsMTQuMiwxNC4yLDAsMCwwLDktMy4xNGwuMDguMDdhMTUuMDgsMTUuMDgsMCwwLDAsOS40OSwzLjQxLDE3LjI5LDE3LjI5LDAsMCwwLDguOTEtMi42M2wzLTEuNzNjOC45NS01LjE4LDE4LjIxLTEwLjUzLDMyLjUzLTI4LjY0czIxLjg2LTU4LjQxLDIzLjM2LTY3LjEzYTM0LjgsMzQuOCwwLDAsMCwxNS4wOCwzLjUxYzcuMjUsMCwxMy42LTIuNDIsMTcuMi02LjIzLDcuMzctNy44LDMuODctMjAuODEtNC42Ny00MC42NC0zLjI2LTcuNTYtMTAuOTEtMjAuNzEtMTctMjQuOTMtMS4yMi0uODUtNC45NS0zLjQ0LTkuMzUtMi42OS0zLjA5LjUzLTcuNzYsMy41MS04LjM2LDMuOTRsLTEuMzgsMWMtNC41MywzLjIzLTEyLjE1LDguNjYtMTgsMTUuMzMtNi43MS01LjU1LTE0LjM2LTEwLjE4LTE4LjY2LTEyYTc0LjYxLDc0LjYxLDAsMCwwLTE0LjMtNC4xMyw4MS45Miw4MS45MiwwLDAsMC0xNC4zLTEuNDVjLTEuMDcsMC0yLjEzLS4wOC0zLjE1LS4xNHYtLjA1bC0uNTIsMC0uNTIsMHYuMDVsLTIuNi4xQTc2LjE4LDc2LjE4LDAsMCwwLDE5Ny43OCwxNDNhNzIuNTksNzIuNTksMCwwLDAtMTQuMDcsNC4xM0E4NC42MSw4NC42MSwwLDAsMCwxNjUuMjMsMTU5Yy01Ljg0LTYuNjEtMTMuNC0xMi0xNy45LTE1LjIxbC0xLjM5LTFjLS42LS40My01LjI3LTMuNDItOC4zNS0zLjk0LTQuNC0uNzUtOC4xMywxLjg0LTkuMzUsMi42OUMxMjIuMTcsMTQ1Ljc2LDExNC41MywxNTguOTEsMTExLjI2LDE2Ni40N1oiIHN0eWxlPSJmaWxsOiAjMDBhNzlkIi8+CiAgICA8cGF0aCBkPSJNMjQzLjc2LDE4Ni4zN2EzMS44OCwzMS44OCwwLDEsMS0zMS44OSwzMS44OEEzMS45MSwzMS45MSwwLDAsMSwyNDMuNzYsMTg2LjM3Wm0tMjIuMTEsMzIuMjVhMjEuNjksMjEuNjksMCwxLDAsMjEuNjktMjEuNjhBMjEuNzIsMjEuNzIsMCwwLDAsMjIxLjY1LDIxOC42MloiIHN0eWxlPSJmaWxsOiAjZWQxYzI0Ii8+CiAgICA8cmVjdCB4PSIxMTIuOTYiIHk9IjM1OS43NSIgd2lkdGg9IjU1Ljg4IiBoZWlnaHQ9IjEuODUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIzNjEuNjciIHk9IjIxOS4zNiIgd2lkdGg9IjAuMDYiIGhlaWdodD0iOC43OCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xOC40MiwzMzEuMzJhOS4wOCw5LjA4LDAsMSwxLS4zNC0xMi40OEg3MC40N3Y5Ljc1YzAsLjkyLDAsMS44My4xMSwyLjczWm0tMTQtNi4wN2E3LjIyLDcuMjIsMCwwLDAsMTIuODMsNC41NmwuMjctLjM0SDcwLjM0di04Ljc4SDE3LjI4bC0uMjctLjNhNy4yMiw3LjIyLDAsMCwwLTEyLjU2LDQuODZaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTM1OS44MiwzMzAuNDVjMC0uNjIuMDUtMS4yNC4wNS0xLjg2VjMxOS41aDEuODV2MS44NWgtLjA1djguNzhoMGMwLC42My0uMDcsMS4yNC0uMTIsMS44NWgtMS43NFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjI2LjUxLDI3Ni45M2MtMywzLjM4LTgsOC4wNS0xMC43NCw3LjMxLTMuMTQtLjg2LTcuODYtNC43Ni0xMC42NS03LjMyLDIuNzUtLjE0LDEwLjE5LS40NywxMC44NS0uNDhsNC4zLjIxQzIyMy4yLDI3Ni43OSwyMjUuNDIsMjc2LjksMjI2LjUxLDI3Ni45M1oiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjA4LjI0LDM3YTkuMDgsOS4wOCwwLDEsMSwxMi40OC0uMzRWNzAuNDNoLTEuODVWMzUuODdsLjMtLjI3YTcuMjIsNy4yMiwwLDEsMC05LjQzLjI3bC4zNS4yOFY3MC40M2gtMS44NVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIzNTkuODciIHk9IjIyOS45OSIgd2lkdGg9IjEuODUiIGhlaWdodD0iODkuNSIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjMxNS45MiIgeT0iMzYxLjU3IiB3aWR0aD0iOC43OCIgaGVpZ2h0PSIwLjA0IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTMxNS40OSwzN0E5LjA5LDkuMDksMCwxLDEsMzI4LDM2LjY4VjcwLjQzaC0xLjg1VjM1Ljg3bC4zMS0uMjdhNy4yMiw3LjIyLDAsMSwwLTkuNDMuMjdsLjM0LjI4VjcwLjQzaC0xLjg1WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjI1OC40NyIgeT0iMzU5Ljc1IiB3aWR0aD0iNTUuNiIgaGVpZ2h0PSIxLjg1IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTExNS4yLDMwLjI4YTcuMjEsNy4yMSwwLDAsMS0yLjM2LDUuMzJsLS4zLjI3VjcwLjQzaC04Ljc5VjM2LjE1bC0uMzQtLjI4YTcuMjIsNy4yMiwwLDEsMSwxMS43OS01LjU5WiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iMjQ4Ljk3IDcwLjQzIDI1Ny43NiA3MC40MyAyNTkuNjEgNzAuNDMgMjU5LjYxIDcyLjI4IDI0Ny4xMyA3Mi4yOCAyNDcuMTMgNzAuNDMgMjQ4Ljk3IDcwLjQzIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTM2MS43MiwyMjguMTV2LTguNzloNTIuNzJsLjI4LS4zNGE3LjI0LDcuMjQsMCwxLDEsLjI4LDkuNDNsLS4yOC0uM1oiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cGF0aCBkPSJNMjMzLjg5LDIxOC4xYTkuNDgsOS40OCwwLDEsMSw5LjQ4LDkuNDdBOS40OSw5LjQ5LDAsMCwxLDIzMy44OSwyMTguMVptMi43OC0uMjRhNi43LDYuNywwLDEsMCw2LjctNi43QTYuNyw2LjcsMCwwLDAsMjM2LjY3LDIxNy44NloiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIxMTQuMzkiIHk9IjcwLjQzIiB3aWR0aD0iNTUuNiIgaGVpZ2h0PSIxLjg1IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTE0MS4xOCwyMDcuNDlzLjA3LjM4LjE3LDFjLS44NS41LTEuNzEsMS0yLjU4LDEuMzctLjIxLTEuMjQtLjMyLTEuOTQtLjMyLTJaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTMxNywzNS44N2E3LjIzLDcuMjMsMCwxLDEsOS40My0uMjdsLS4zMS4yN1Y3MC40M2gtOC43OFYzNi4xNVoiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cGF0aCBkPSJNMzIwLjQ4LDQwOWE3LjIxLDcuMjEsMCwwLDEtNC44Ny0xMi41NWwuMzEtLjI3VjM2MS42aDguNzh2MzQuMjVsLjM0LjI4QTcuMjIsNy4yMiwwLDAsMSwzMjAuNDgsNDA5WiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxwYXRoIGQ9Ik0zNjEuNjgsMzMwLjEzYzAtLjUxLDAtMSwwLTEuNTR2LTcuMjRoNTIuNzJsLjI4LS4zNGE3LjIzLDcuMjMsMCwxLDEsLjI4LDkuNDFsLS4yOC0uMjlaIiBzdHlsZT0iZmlsbDogIzkzOTU5OCIvPgogICAgPHJlY3QgeD0iMjU5LjYxIiB5PSI3MC40MyIgd2lkdGg9IjU1Ljg4IiBoZWlnaHQ9IjEuODUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNOTIuNSwzNDEuNDJIMzM4Ljc2Vjk1LjIzSDkyLjVaTTcyLjMyLDIxNy4xNlYxMDMuNDVBMzEuMjEsMzEuMjEsMCwwLDEsMTAzLjUsNzIuMjhIMzI4LjY5YTMxLjIxLDMxLjIxLDAsMCwxLDMxLjE4LDMxLjE3djMuNDVoLS4wNXYxMi40OGguMDV2OTguMTRoLS4wNVYyMzBoLjA1VjMxOS41aC0uMDV2MTAuOTVhMzEuMjIsMzEuMjIsMCwwLDEtMzEuMTMsMjkuM2gtMi4xNHYwSDMxNC4wN3YwaC01NS42djBIMjQ2djBIMjIwLjIydjBIMjA3Ljc0djBIMTgxLjMzdjBIMTY4Ljg1djBIMTEzdjBIMTAxLjlhMzEuMjMsMzEuMjMsMCwwLDEtMjkuNTgtMzEuMTNaIiBzdHlsZT0iZmlsbDogIzZkNmU3MSIvPgogICAgPHBhdGggZD0iTTEwMi4zMywzOTYuMTNWMzYxLjU4bDEuMTcsMGg3LjYxdjM0LjI1bC4zNS4yOGE3LjIzLDcuMjMsMCwxLDEtOS40My4yN1oiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cmVjdCB4PSIxODEuMzMiIHk9IjM1OS43NSIgd2lkdGg9IjI2LjQxIiBoZWlnaHQ9IjEuODUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMTY1LjIzLDE1OWE4NC42MSw4NC42MSwwLDAsMSwxOC40OC0xMS44NEE3Mi41OSw3Mi41OSwwLDAsMSwxOTcuNzgsMTQzYTc2LjE4LDc2LjE4LDAsMCwxLDE0LjU2LTEuNDlsMi42LS4xLS4xOCwyLjcxLjY0LDBjLS45MywwLTEuOTMuMDgtMywuMTJhNzQuNjIsNzQuNjIsMCwwLDAtMTQsMS40Myw2OS4wOCw2OS4wOCwwLDAsMC0xMy41OCw0Yy00LjE1LDEuNzUtMTEuNjQsNi4yOS0xNy43OCwxMS40MUMxNjYuNDQsMTYwLjM5LDE2NS44NCwxNTkuNjgsMTY1LjIzLDE1OVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjE0Ljc1LDMwNWMtLjIyLTIuMy0uNy0xMy4yOS0uNC0xOC4yNy4yMy4wOS40Ni4xNi42OS4yM2E0LjYxLDQuNjEsMCwwLDAsMS4yOS4xNmwuNjEsMGMwLDQuMzYtLjE0LDE1LjE1LS4zNSwxNy40NWEzLjYsMy42LDAsMCwxLTEsMnMwLDAtLjA1LDBBMi4zNCwyLjM0LDAsMCwxLDIxNC43NSwzMDVaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTI4Ny40LDE0NSwyODYsMTQ2Yy01LjU2LDQtMTUuOTIsMTEuMzQtMjEuNDQsMjBsLTIuMzQtMS40OWMuNzItMS4xNCwxLjUzLTIuMjYsMi4zOC0zLjM1LjMuMjMuNTcuNDcuODYuNzFsMS44LTIuMWMtLjI4LS4yNS0uNTgtLjQ5LS44OC0uNzQsNS44Ni02LjY3LDEzLjQ4LTEyLjEsMTgtMTUuMzNsMS4zOC0xYy42LS40Myw1LjI3LTMuNDEsOC4zNi0zLjk0LDQuNC0uNzUsOC4xMywxLjg0LDkuMzUsMi42OSw2LjA2LDQuMjIsMTMuNzEsMTcuMzcsMTcsMjQuOTMsOC41NCwxOS44MywxMiwzMi44NCw0LjY3LDQwLjY0LTMuNiwzLjgxLTkuOTUsNi4yMy0xNy4yLDYuMjNhMzQuOCwzNC44LDAsMCwxLTE1LjA4LTMuNTFjLjE1LS44OS4yNC0xLjQ1LjI3LTEuNjNsLjE1LTEuMjhjOS41OCw0LjgsMjMuMTksNS4zMSwyOS44NC0xLjcyLDUuNTItNS44Myw0LjExLTE2LTUuMi0zNy42My0zLjI1LTcuNTUtMTAuNjMtMjAtMTYtMjMuNzUtMS0uNjktNC0yLjc5LTcuMzEtMi4yNEMyOTIuMjcsMTQyLDI4OC4xMiwxNDQuNTIsMjg3LjQsMTQ1WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjIyMC4yMiIgeT0iMzU5Ljc1IiB3aWR0aD0iMjUuNzciIGhlaWdodD0iMS44NSIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjI0Ny44NCIgeT0iMzYxLjU3IiB3aWR0aD0iOC43OCIgaGVpZ2h0PSIwLjA0IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTE4MC42Miw0OC40OHYyMmgtOC43OVY1Ny4yNkgxNTAuMTFWMzZsLS4zMy0uMjhhNy4yMyw3LjIzLDAsMSwxLDkuNDIsMGwtLjMxLjI4VjQ4LjQ4WiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iMTY4Ljg1IDM1OS43NSAxODEuMzMgMzU5Ljc1IDE4MS4zMyAzNjEuNiAxNzkuNDggMzYxLjYgMTc5LjQ4IDM2MS41NyAxNzAuNyAzNjEuNTcgMTcwLjcgMzYxLjYgMTY4Ljg1IDM2MS42IDE2OC44NSAzNTkuNzUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjE1LDI4Ni45MWMtLjIzLS4wNy0uNDYtLjE0LS42OS0uMjMsMC0uMzEsMC0uNjEuMDYtLjg2bDEuNjIsMCwuOTEuMDlWMjg3bC0uNjEsMEE0LjYxLDQuNjEsMCwwLDEsMjE1LDI4Ni45MVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMTEuNjgsMjMwLjhBNy4yMyw3LjIzLDAsMSwxLDE3LDIxOC43MWwuMjcuM0g3MC4zNHY4Ljc4SDE3LjU1bC0uMjcuMzVBNy4yLDcuMiwwLDAsMSwxMS42OCwyMzAuOFoiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cG9seWdvbiBwb2ludHM9IjM2MS42NyAxMTcuNTMgMzYxLjcyIDExNy41MyAzNjEuNzIgMTE5LjM4IDM1OS44NyAxMTkuMzggMzU5Ljg3IDEwNi45IDM2MS43MiAxMDYuOSAzNjEuNzIgMTA4Ljc1IDM2MS42NyAxMDguNzUgMzYxLjY3IDExNy41MyIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjI0NS45OSIgeT0iMzU5LjcyIiB3aWR0aD0iMTIuNDgiIGhlaWdodD0iMC4wNCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yMTMuODQsMzA0LjEzYy4xOC0yLjQuMzMtMTMuMzguMzItMTcuNTFhLjcuNywwLDAsMCwuMTkuMDZjLS4zLDUsLjE4LDE2LC40LDE4LjI3YTIuMzQsMi4zNCwwLDAsMCwuNzUsMS41MywxNC4yLDE0LjIsMCwwLDEtOSwzLjE0LDE3LjkxLDE3LjkxLDAsMCwxLTkuMTgtMi43NWwtMy0xLjc0Yy04Ljk1LTUuMTctMTguMjEtMTAuNTItMzIuNTQtMjguNjMtNi42My04LjM5LTEyLjU5LTIyLjUxLTE3LjctNDEuOTMtMi44OS0xMS00LjY4LTIwLjY5LTUuMzctMjQuNy44Ny0uNDEsMS43My0uODcsMi41OC0xLjM3LDEuMTgsNyw4LjYxLDQ4LjQ5LDIyLjY3LDY2LjI4czIyLjYyLDIyLjY3LDMxLjc0LDI4YzEsLjU3LDIsMS4xNiwzLDEuNzUsOC4xOCw0LjgzLDEzLjc2Ljg4LDE0LjkzLS4xWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xMDYuNiwyMDcuMTFjLTcuMzgtNy44LTMuODctMjAuODEsNC42Ni00MC42NCwzLjI3LTcuNTYsMTAuOTEtMjAuNzEsMTctMjQuOTMsMS4yMi0uODUsNC45NS0zLjQ0LDkuMzUtMi42OSwzLjA4LjUyLDcuNzUsMy41MSw4LjM1LDMuOTRsMS4zOSwxYzQuNSwzLjIxLDEyLjA2LDguNiwxNy45LDE1LjIxbC0uOTUuOCwxLjgxLDIuMS45Mi0uNzhhMzguOCwzOC44LDAsMCwxLDIuNDgsMy40OGwtMi4zMywxLjQ5Yy01LjUyLTguNy0xNS44OC0xNi4wOC0yMS40NC0yMGwtMS40LTFjLS43MS0uNTEtNC44OC0zLjA2LTcuMjEtMy40Ni0zLjI4LS41NS02LjI5LDEuNTUtNy4yOSwyLjI0LTUuMzgsMy43NC0xMi43NSwxNi4yLTE2LDIzLjc1LTkuMywyMS42LTEwLjcxLDMxLjgtNS4xOSwzNy42Myw2LjU1LDYuOTQsMTkuODksNi41NCwyOS40NSwxLjkxbC4zOC43OXMuMTEuNzMuMzIsMmEzNC43OCwzNC43OCwwLDAsMS0xNSwzLjQ3QzExNi41NCwyMTMuMzQsMTEwLjIsMjEwLjkyLDEwNi42LDIwNy4xMVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cG9seWdvbiBwb2ludHM9IjIwNy43NCAzNTkuNzUgMjIwLjIyIDM1OS43NSAyMjAuMjIgMzYxLjYgMjE4LjM3IDM2MS42IDIxOC4zNyAzNjEuNTcgMjA5LjU5IDM2MS41NyAyMDkuNTkgMzYxLjYgMjA3Ljc0IDM2MS42IDIwNy43NCAzNTkuNzUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNNzIuMTksMzI4LjU5djIuNzNINzAuNThjLS4wNy0uOS0uMTEtMS44MS0uMTEtMi43M3YtOS43NWgxLjcyWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xNjcsMTYxLjExbC0uOTIuNzgtMS44MS0yLjEuOTUtLjhDMTY1Ljg0LDE1OS42OCwxNjYuNDQsMTYwLjM5LDE2NywxNjEuMTFaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTIxNiwxNDEuMzh2LjA1bC0uNTIsMFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjE2LDI4NS44aC45MXYuMVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNNzIuMTksMzMxLjMydi0yLjczaC4xM2EzMS4yMywzMS4yMywwLDAsMCwyOS41OCwzMS4xM2gtMS40MnYxLjc0YTMzLjA3LDMzLjA3LDAsMCwxLTI5LjktMzAuMTRaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTExLjY4LDMzMi40OEE3LjIzLDcuMjMsMCwxLDEsMTcsMzIwLjM5bC4yNy4zSDcwLjM0djguNzhIMTcuNTVsLS4yNy4zNEE3LjE4LDcuMTgsMCwwLDEsMTEuNjgsMzMyLjQ4WiIgc3R5bGU9ImZpbGw6ICM5Mzk1OTgiLz4KICAgIDxwYXRoIGQ9Ik0yMjUuMDcsMzEwYTE1LjA4LDE1LjA4LDAsMCwxLTkuNDktMy40MWwtLjA4LS4wN3MwLDAsLjA1LDBhMy42LDMuNiwwLDAsMCwxLTJjLjIxLTIuMy4zNS0xMy4wOS4zNS0xNy40NWEuNDUuNDUsMCwwLDAsLjE2LDBjLS4yNiw0LjcuMTksMTUsLjM5LDE3LjUzLDEuNzEsMS40LDcuMjgsNSwxNS4wNy40bDMtMS43NWM5LjEyLTUuMjcsMTcuNzQtMTAuMjYsMzEuNzQtMjcuOTUsMTQuMzEtMTguMSwyMS45NC02MC45LDIyLjk0LTY2LjguODYuNTEsMS43MiwxLDIuNTksMS4zOS0xLjUsOC43Mi05LDQ5LTIzLjM2LDY3LjEzUzI0NS45MSwzMDAuNDIsMjM3LDMwNS42bC0zLDEuNzNBMTcuMjksMTcuMjksMCwwLDEsMjI1LjA3LDMxMFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMTEuNjgsMTE5Ljg4QTcuMjMsNy4yMywwLDEsMSwxNywxMDcuNzlsLjI3LjNINzAuMzR2OC43OEgxNy41NWwtLjI3LjM0QTcuMTgsNy4xOCwwLDAsMSwxMS42OCwxMTkuODhaIiBzdHlsZT0iZmlsbDogIzkzOTU5OCIvPgogICAgPHBhdGggZD0iTTIxNiwyODUuOGwtMS42MiwwYzAtLjA3LDAtLjEzLDAtLjE5WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yOTAuMzcsMjA3Ljc2bDIuNzUuNDRjMCwuMTgtLjEyLjc0LS4yNywxLjYzLS44Ny0uNDItMS43My0uODgtMi41OS0xLjM5QzI5MC4zMiwyMDgsMjkwLjM2LDIwNy43OSwyOTAuMzcsMjA3Ljc2WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjIwNy43NCIgeT0iMzU5LjcyIiB3aWR0aD0iMTIuNDgiIGhlaWdodD0iMC4wNCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xMS42OCwxMjEuNzNhOS4wOCw5LjA4LDAsMSwxLDYuNC0xNS40OUg3MC40N3YxMi40OGgtNTJBOSw5LDAsMCwxLDExLjY4LDEyMS43M1ptMC0xLjg1YTcuMTgsNy4xOCwwLDAsMCw1LjYtMi42N2wuMjctLjM0SDcwLjM0di04Ljc4SDE3LjI4bC0uMjctLjNhNy4yMiw3LjIyLDAsMSwwLTUuMzMsMTIuMDlaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHJlY3QgeD0iMzU5Ljg3IiB5PSIxMTkuMzgiIHdpZHRoPSIxLjg1IiBoZWlnaHQ9Ijk4LjE0IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTQxNC43MiwxMDguNDFsLS4yOC4zNEgzNjEuNzJWMTA2LjloNTEuODZBOS4wNyw5LjA3LDAsMSwxLDQyMC4zMiwxMjJhOS4xLDkuMSwwLDAsMS02LjQtMi42NWgtNTIuMnYtMS44NWg1M2wuMjguMjlhNy4yMSw3LjIxLDAsMSwwLS4yOC05LjQxWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yMTUuNzcsMjg0LjI0YzIuNzMuNzQsNy43OC0zLjkzLDEwLjc0LTcuMzEtMS4wOSwwLTMuMzEtLjE0LTYuMjQtLjI4bC00LjMtLjIxYy0uNjYsMC04LjEuMzQtMTAuODUuNDhDMjA3LjkxLDI3OS40OCwyMTIuNjMsMjgzLjM4LDIxNS43NywyODQuMjRabS0xMS44NS0xMGMuODItLjA3LDExLjE1LS41OSwxMi4xMy0uNTVsNC4zNC4yYzIuNzcuMTQsNi41Ni4zMiw2LjkyLjMyYTQuMjMsNC4yMywwLDAsMSwyLjQsMS4wOWwxLC44Ny0uODEsMWMtLjgsMS03LjI5LDkuMTEtMTIuOCw5LjgzLDAtLjQxLjA1LS43OC4wOS0xLjA5bC0uMjUsMHYtLjFIMjE2bC0xLjYtLjE3YzAsLjA2LDAsLjEyLDAsLjE5aC0uMjV2LjhjLTUuMy0yLTEyLjI5LTguOTUtMTIuNi05LjI1bC0xLjA2LTEuMDcsMS4xNS0xQTQuODYsNC44NiwwLDAsMSwyMDMuOTIsMjc0LjIyWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xMS42OCwyMzIuNjVhOS4wOCw5LjA4LDAsMSwxLDYuNC0xNS40OUg3MC40N3YxMi40OGgtNTJBOSw5LDAsMCwxLDExLjY4LDIzMi42NVptMC0xLjg1YTcuMiw3LjIsMCwwLDAsNS42LTIuNjZsLjI3LS4zNUg3MC4zNFYyMTlIMTcuMjhsLS4yNy0uM2E3LjIyLDcuMjIsMCwxLDAtNS4zMywxMi4wOVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjA5LjU5LDM5Ni4xM1YzNjEuNmg4Ljc4djM0LjI1bC4zNC4yOGE3LjIzLDcuMjMsMCwxLDEtOS40My4yN1oiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cGF0aCBkPSJNMzYxLjcyLDMyOC41OWMwLC41MSwwLDEsMCwxLjU0aDB2LTguNzhoLjA1WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iMzE1LjQ5IDcyLjI4IDMxNS40OSA3MC40MyAzMTcuMzQgNzAuNDMgMzI2LjEyIDcwLjQzIDMyNy45NyA3MC40MyAzMjcuOTcgNzIuMjggMzE1LjQ5IDcyLjI4IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTQxMy45MiwzMzJIMzYxLjU2Yy4wNS0uNjEuMS0xLjIyLjEyLTEuODVoNTNsLjI4LjI5YTcuMjEsNy4yMSwwLDEsMC0uMjgtOS40MWwtLjI4LjM0SDM2MS43MlYzMTkuNWg1MS44NmE5LjA3LDkuMDcsMCwxLDEsNi43NCwxNS4xM0E5LjEsOS4xLDAsMCwxLDQxMy45MiwzMzJaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTk4LjksMzAuMjhhOS4wOCw5LjA4LDAsMSwxLDE1LjQ5LDYuNFY3MC40M2gtMS44NVYzNS44N2wuMy0uMjdhNy4yMiw3LjIyLDAsMSwwLTkuNDMuMjdsLjM0LjI4VjcwLjQzaC0uMjVjLS41NCwwLTEuMDcsMC0xLjU5LDBWMzdBOSw5LDAsMCwxLDk4LjksMzAuMjhaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTQxNC43MiwyMTlsLS4yOC4zNEgzNjEuNzJ2LTEuODRoNTEuODZhOS4wOSw5LjA5LDAsMSwxLC4zNCwxMi40N2gtNTIuMnYtMS44NGg1M2wuMjguM2E3LjIxLDcuMjEsMCwxLDAtLjI4LTkuNDNaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTIzMi44NiwxNDUuNzNBODAuNTYsODAuNTYsMCwwLDAsMjE5LDE0NC4zNGMtMS4yNSwwLTIuNDUtLjA5LTMuNjMtLjE2bC43NiwwLS4xOC0yLjcxYzEsLjA2LDIuMDguMSwzLjE1LjE0YTgxLjkyLDgxLjkyLDAsMCwxLDE0LjMsMS40NSw3NC42MSw3NC42MSwwLDAsMSwxNC4zLDQuMTNjNC4zLDEuNzgsMTIsNi40MSwxOC42NiwxMi0uNjIuNjktMS4yMSwxLjQxLTEuNzgsMi4xMy02LjQzLTUuMzItMTMuOTQtOS44Ny0xOC0xMS41M0E3MS4zMiw3MS4zMiwwLDAsMCwyMzIuODYsMTQ1LjczWiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxyZWN0IHg9IjcwLjQ3IiB5PSIyMTcuMTYiIHdpZHRoPSIxLjcyIiBoZWlnaHQ9IjEyLjQ4IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTExNC4zOSw3Mi4yOEgxMDEuOTF2LTEuOGMuNTIsMCwxLDAsMS41OSwwaDEwLjg5WiIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0xMTEuMTEsMzYxLjU3aC04Ljc4Yy0uNjIsMC0xLjI0LS4wNi0xLjg1LS4xMnYtMS43NGgxLjQyYy41MiwwLDEuMDYsMCwxLjYsMEgxMTN2MS44NWgtMS44NVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMzYxLjcyLDExNy41M3YtOC43OGg1Mi43MmwuMjgtLjM0YTcuMjMsNy4yMywwLDEsMSwuMjgsOS40MWwtLjI4LS4yOVoiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cGF0aCBkPSJNMjY3LjI3LDE1OS44NWwtMS44LDIuMWMtLjI5LS4yNC0uNTYtLjQ4LS44Ni0uNzEuNTctLjcyLDEuMTYtMS40NCwxLjc4LTIuMTNDMjY2LjY5LDE1OS4zNiwyNjcsMTU5LjYsMjY3LjI3LDE1OS44NVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjgzLDQwMS43NWE5LjA4LDkuMDgsMCwxLDEtMTUuMzItNi41N3YtOS44MUgyNDZWMzYxLjZoMS44NXYyMS45MmgyMS43M1YzOTZsLS4zMi4yN2E3LjIzLDcuMjMsMCwxLDAsOS40MiwwbC0uMzItLjI3VjM3NC43NEgyNTYuNjJWMzYxLjZoMS44NXYxMS4yOUgyODAuMnYyMi4yOUE5LDksMCwwLDEsMjgzLDQwMS43NVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIxNzAuNyIgeT0iMzYxLjU3IiB3aWR0aD0iOC43OCIgaGVpZ2h0PSIwLjA0IiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTMxMy4yNSw0MDEuNzJBNy4yMyw3LjIzLDAsMSwwLDMyNSwzOTYuMTNsLS4zNC0uMjhWMzYxLjZoMS44NVYzOTVhOS4wOSw5LjA5LDAsMSwxLTEyLjQ4LjM0VjM2MS42aDEuODV2MzQuNTNsLS4zMS4yN0E3LjIzLDcuMjMsMCwwLDAsMzEzLjI1LDQwMS43MloiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMTUzLjM2LDQwOWE3LjIzLDcuMjMsMCwwLDEtNC43Mi0xMi43TDE0OSwzOTZWMzc0Ljc0SDE3MC43VjM2MS42aDguNzh2MjEuOTJIMTU3Ljc1VjM5NmwuMzIuMjdhNy4yMyw3LjIzLDAsMCwxLTQuNzEsMTIuN1oiIHN0eWxlPSJmaWxsOiAjOTM5NTk4Ii8+CiAgICA8cGF0aCBkPSJNMjkwLDIwOC4yN2MtMTEuODEtNy4wNi0xMi41Ny0xMy43OC0xMi45LTE2LjY1LDAtLjI0LS4wNS0uNDYtLjA4LS42NGwyLjc0LS40NmMwLC4yMy4wNi40OS4xLjguMjgsMi40Ni45Myw4LjIxLDExLjU3LDE0LjU3LjYxLjM2LDEuMjQuNzEsMS44OCwxbC0uMTUsMS4yOC0yLjc1LS40NHMtLjA1LjI2LS4xMS42OFoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjgyLjMzLDMwLjI1YTcuMjMsNy4yMywwLDEsMC0xMS45NCw1LjQ2bC4zMS4yOFY0OC40OEgyNDl2MjJoLTEuODRWNDYuNjNoMjEuNzJWMzYuODJhOS4wOCw5LjA4LDAsMSwxLDEyLjQ5LDBWNTkuMTFIMjU5LjYxVjcwLjQzaC0xLjg1VjU3LjI2aDIxLjczVjM2bC4zMi0uMjhBNy4yLDcuMiwwLDAsMCwyODIuMzMsMzAuMjVaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHJlY3QgeD0iNzAuNDciIHk9IjEwNi4yNCIgd2lkdGg9IjEuNzIiIGhlaWdodD0iMTIuNDgiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMTc0LDIxNy44N2E2LjcsNi43LDAsMSwwLDYuNy02LjdBNi43MSw2LjcxLDAsMCwwLDE3NCwyMTcuODdabTYuNyw5LjQ3YTkuNDgsOS40OCwwLDEsMSw5LjQ4LTkuNDdBOS40OSw5LjQ5LDAsMCwxLDE4MC43MywyMjcuMzRaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTExMS4xMSwzNjEuNTd2MEgxMDMuNWwtMS4xNywwaDguNzhaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTMyOC42OSwzNTkuNzVhMzEuMjIsMzEuMjIsMCwwLDAsMzEuMTMtMjkuM1YzMzJoMS43NGEzMy4wOSwzMy4wOSwwLDAsMS0zMi44NywyOS42MmgtMi4xNHYtMS44NVoiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNOTMuNDMsOTYuMTZWMzQwLjQ5SDMzNy44NFY5Ni4xNlpNMzM4Ljc2LDM0MS40Mkg5Mi41Vjk1LjIzSDMzOC43NloiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIzNTkuODIiIHk9IjEwNi45IiB3aWR0aD0iMC4wNiIgaGVpZ2h0PSIxMi40OCIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwYXRoIGQ9Ik0yMTYsMTQxLjQzbC4xOCwyLjcxLS43NiwwLS42NCwwLC4xOC0yLjcxLjUyLDBaIiBzdHlsZT0iZmlsbDogIzIzMWYyMCIvPgogICAgPHBhdGggZD0iTTE3MS4yNSwyMTcuODdhOS40OCw5LjQ4LDAsMSwwLDkuNDgtOS40OEE5LjQ5LDkuNDksMCwwLDAsMTcxLjI1LDIxNy44N1ptNzIuNTEsMzVhMzQuNjYsMzQuNjYsMCwxLDAtMzQuNjYtMzQuNjVBMzQuNjksMzQuNjksMCwwLDAsMjQzLjc2LDI1Mi45Wm0tMjkuNiwzMy43MmMwLDQuMTMtLjE0LDE1LjExLS4zMiwxNy41MWwtLjE0LjI1Yy0xLjE3LDEtNi43NSw0LjkzLTE0LjkzLjEtMS0uNTktMi0xLjE4LTMtMS43NS05LjEyLTUuMjgtMTcuNzQtMTAuMjYtMzEuNzQtMjhzLTIxLjQ5LTU5LjI0LTIyLjY3LTY2LjI4YTQuMjMsNC4yMywwLDAsMCwuNDEtLjIzYzEyLjA5LTcuMjMsMTUuMjQtMTIuMzgsMTUuNzYtMTUuNDRsLTIuNzQtLjQ3Yy0uMjcsMS42NC0yLjIzLDYuMjMtMTQuNDQsMTMuNTMtLjczLjQzLTEuNDkuODQtMi4yNywxLjIyLTkuNTYsNC42My0yMi45LDUtMjkuNDUtMS45MS01LjUyLTUuODMtNC4xMS0xNiw1LjE5LTM3LjYzLDMuMjYtNy41NSwxMC42My0yMCwxNi0yMy43NSwxLS42OSw0LTIuNzksNy4yOS0yLjI0LDIuMzMuNCw2LjUsMi45NSw3LjIxLDMuNDZsMS40LDFjNS41Niw0LDE1LjkyLDExLjM0LDIxLjQ0LDIwbDIuMzMtMS40OWEzOC44LDM4LjgsMCwwLDAtMi40OC0zLjQ4YzYuMTQtNS4xMiwxMy42My05LjY2LDE3Ljc4LTExLjQxYTY5LjA4LDY5LjA4LDAsMCwxLDEzLjU4LTQsNzQuNjIsNzQuNjIsMCwwLDEsMTQtMS40M2MxLjA1LDAsMi4wNS0uMDcsMy0uMTIsMS4xOC4wNywyLjM4LjEyLDMuNjMuMTZhODAuNTYsODAuNTYsMCwwLDEsMTMuODMsMS4zOSw3MS4zMiw3MS4zMiwwLDAsMSwxMy44LDRjNCwxLjY2LDExLjUyLDYuMjEsMTgsMTEuNTMtLjg1LDEuMDktMS42NiwyLjIxLTIuMzgsMy4zNWwyLjM0LDEuNDljNS41Mi04LjcsMTUuODgtMTYuMDgsMjEuNDQtMjBsMS4zOS0xYy43Mi0uNTIsNC44Ny0zLjA2LDcuMi0zLjQ2LDMuMjktLjU1LDYuMzEsMS41NSw3LjMxLDIuMjQsNS4zNywzLjc0LDEyLjc1LDE2LjIsMTYsMjMuNzUsOS4zMSwyMS42LDEwLjcyLDMxLjgsNS4yLDM3LjYzLTYuNjUsNy0yMC4yNiw2LjUyLTI5Ljg0LDEuNzItLjY0LS4zMi0xLjI3LS42Ny0xLjg4LTEtMTAuNjQtNi4zNi0xMS4yOS0xMi4xMS0xMS41Ny0xNC41NywwLS4zMS0uMDctLjU3LS4xLS44TDI3NywxOTFjMCwuMTguMDYuNC4wOC42NC4zMywyLjg3LDEuMDksOS41OSwxMi45LDE2LjY1bC4zLjE3Yy0xLDUuOS04LjYzLDQ4LjctMjIuOTQsNjYuOC0xNCwxNy42OS0yMi42MiwyMi42OC0zMS43NCwyNy45NWwtMywxLjc1Yy03Ljc5LDQuNjEtMTMuMzYsMS0xNS4wNy0uNC0uMi0yLjQ5LS42NS0xMi44My0uMzktMTcuNTMsNS41MS0uNzIsMTItOC43OSwxMi44LTkuODNsLjgxLTEtMS0uODdhNC4yMyw0LjIzLDAsMCwwLTIuNC0xLjA5Yy0uMzYsMC00LjE1LS4xOC02LjkyLS4zMmwtNC4zNC0uMmMtMSwwLTExLjMxLjQ4LTEyLjEzLjU1YTQuODYsNC44NiwwLDAsMC0yLjI3LDEuMWwtMS4xNSwxLDEuMDYsMS4wN0MyMDEuODcsMjc3LjY3LDIwOC44NiwyODQuNjQsMjE0LjE2LDI4Ni42MloiIHN0eWxlPSJmaWxsOiAjZjFmMmYyIi8+CiAgICA8cmVjdCB4PSIyMjAuNzIiIHk9IjcwLjQzIiB3aWR0aD0iMjYuNDEiIGhlaWdodD0iMS44NSIgc3R5bGU9ImZpbGw6ICMyMzFmMjAiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iMzE0LjA3IDM1OS43NSAzMjYuNTUgMzU5Ljc1IDMyNi41NSAzNjEuNiAzMjQuNyAzNjEuNiAzMjQuNyAzNjEuNTcgMzE1LjkyIDM2MS41NyAzMTUuOTIgMzYxLjYgMzE0LjA3IDM2MS42IDMxNC4wNyAzNTkuNzUiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cGF0aCBkPSJNMjE0LjE2LDI4NS44MmguMjVjMCwuMjUsMCwuNTUtLjA2Ljg2YS43LjcsMCwwLDEtLjE5LS4wNloiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgICA8cmVjdCB4PSIxNjguODUiIHk9IjM1OS43MiIgd2lkdGg9IjEyLjQ4IiBoZWlnaHQ9IjAuMDQiIHN0eWxlPSJmaWxsOiAjMjMxZjIwIi8+CiAgPC9nPgo8L3N2Zz4K';

/**
 * @readonly
 * @enum {number}
 */
const BLECommand = {
    CMD_LIGHT_ON: 0x01,
    CMD_LIGHT_OFF: 0x00,
    CMD_BRIGHTNESS_DULL: 0x0F,
    CMD_BRIGHTNESS_MEDIUM: 0x1E,
    CMD_BRIGHTNESS_BRIGHT: 0x3C,
    CMD_BRIGHTNESS_BRIGHTEST: 0x64,
    CMD_TEMPERATURE_COOL: 0x64,
    CMD_TEMPERATURE_NEUTRAL: 0x32,
    CMD_TEMPERATURE_WARM: 0x00
};

const BLETimeout = 4500; // TODO: might need tweaking based on how long the device takes to start sending data

/**
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    //TO DO: BLESession is returning error "could not determine UUID for service"
    service: 'dd649f02-14fe-11e5-b60b-1697f925ecdd',
    lightingService: "ffe8badc-e1cb-46c6-9ad9-631ea7cbadff",
    onOffChar: '00a26834-5cf4-48e5-ae1c-9e1234c03e00',
    brightnessChar: 'bbe8badc-e1cb-46c6-9ad9-631ea7cba2bb',
    temperatureChar: 'cce8badc-e1cb-46c6-9ad9-631ea7cba2cc'
};

/**
 * Manage communication with a Ara device over a Scrath Link client socket.
 */
class AraConnector {

    /**
     * Construct a Ara communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection session for reading/writing device data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */

        this._sensors = {
            lightState: null,
            brightnessState: null,
            temperatureState: null
        };

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false; 

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;
        this._onOffInterval = null;
        this._brightnessInterval = null;
        this._temperatureInterval = null;

        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._processOnOffData = this._processOnOffData.bind(this);
        this._processBrightnessData = this._processBrightnessData.bind(this);
        this._processTemperatureData = this._processTemperatureData.bind(this);
    }


    setLightState (lightState) {
        this._sensors.lightState = lightState;
    }

    setBrightnessState (brightnessState) {
        this._sensors.brightnessState = brightnessState;
    }

    setTemperatureState(tempState) {
        this._sensors.temperatureState = tempState;
    }

    /**
     * @return {text} - the latest value received for the light state sensor.
     */
    get lightState() {
        return this._sensors.lightState;
    }

    /**
     * @return {text} - the latest value received for the brightness state sensor.
     */
    get brightnessState() {
        return this._sensors.brightnessState;
    }

     /**
     * @return {text} - the latest value received for the temperature state sensor.
     */
    get temperatureState() {
        return this._sensors.temperatureState;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.lightingService]} ] ,
                optionalServices: [BLEUUID.service]
        }, this._onConnect);
    }

    connect (id) {
        this._ble.connectPeripheral(id);
    }

    disconnect () {
        window.clearInterval(this._brightnessInterval);
        window.clearInterval(this._onOffInterval);
        window.clearInterval(this._temperatureInterval);
        window.clearInterval(this._timeoutID);
        this._ble.disconnect();
    }

    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    /**
     * Process the on/off sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processOnOffData (lightState) {
        const data = Base64Util.base64ToUint8Array(lightState);
        if (data == 1) {
            this._sensors.lightState = 'on';
        } else if (data == 0) {
            this._sensors.lightState = 'off';
        }
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
    }

    /**
     * Process the brightness sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processBrightnessData (brightnessState) {
        const data = Base64Util.base64ToUint8Array(brightnessState);
        if (data == 100) {
            this._sensors.brightnessState = 'brightest';
        } else if (data == 60){
            this._sensors.brightnessState = 'bright';
        } else if (data == 30) {
            this._sensors.brightnessState = 'medium';
        } else if (data == 15) {
            this._sensors.brightnessState = 'dull';
        }
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
        }

    /**
     * Process the temperature sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processTemperatureData (temperatureState) {
        const data = Base64Util.base64ToUint8Array(temperatureState);
        if (data == 0) {
            this._sensors.temperatureState = 'warm';
        } else if (data == 50) {
            this._sensors.temperatureState = 'neutral';
        } else if (data == 100) {
            this._sensors.temperatureState = 'cool';
        }
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
    }

    /**
     * Write a message to the device BLE session.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write.
     * @return {Promise} - a Promise that resolves when writing to device.
     * @private
     */
    send (characteristicId, command) {
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        if (command != BLECommand.CMD_LIGHT_OFF && command != BLECommand.CMD_LIGHT_ON) {
            this._busy = true;
        }

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);
    
        const output = new Uint8Array(1);
        output[0] = command;
        const data = Base64Util.uint8ArrayToBase64(output);
        this._ble.write(BLEUUID.lightingService, characteristicId, data, "base64", true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        )
    }

    // MUTABLE DEVICE NAME UUID: d396ef20-1502-11e5-b60b-2227f925ec1d'

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {
        console.log("onConnect called");
        this._ble.read(BLEUUID.lightingService, BLEUUID.temperatureChar, true, this._processTemperatureData).then( () => {
        this._onOffInterval = window.setInterval(() => {
            this._ble.read(BLEUUID.lightingService, BLEUUID.onOffChar, true, this._processOnOffData);
        }, 100);
        this._brightnessInterval = window.setInterval(() => {
        this._ble.read(BLEUUID.lightingService, BLEUUID.brightnessChar, true, this._processBrightnessData);
    }, 125);
        this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
        });
    }
}

/**
 * * Enum for on / off indicator.
* @readonly
* @enum {string}
*/
const onOffIndicator = {
    ON: 'on',
    OFF: 'off'
};

/**
 * * Enum for brightness indicator.
* @readonly
* @enum {string}
*/
const brightnessIndicator = {
    DULL: 'dull',
    MEDIUM: 'medium',
    BRIGHT: 'bright',
    BRIGHTEST: 'brightest'
};

/**
 * * Enum for temperature indicator.
* @readonly
* @enum {string}
*/
const temperatureIndicator = {
    COOL: 'cool',
    NEUTRAL: 'neutral',
    WARM: 'warm'
};

/**
 * Scratch 3.0 blocks to interact with a Ara device.
 */
class Scratch3AraConnectorBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Ara Light';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'araConnector';
    }

    /**
     * @return {array} - text and values for each on/off menu element
     */
    get ON_OFF_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.onOffMenu.on',
                    default: 'on',
                    description: 'label for on element in light state picker for araConnector extension'
                }),
                value: onOffIndicator.ON
            },
            {
                text: formatMessage({
                    id: 'araConnector.onOffMenu.off',
                    default: 'off',
                    description: 'label for off element in light state picker for araConnector extension'
                }),
                value: onOffIndicator.OFF
            },
        ];
    }
    
    /**
     * @return {array} - text and values for each brightness menu element
     */
    get BRIGHTNESS_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.dull',
                    default: 'dull',
                    description: 'label for dull element in brightness state picker for araConnector extension'
                }), 
                value: brightnessIndicator.DULL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.medium',
                    default: 'medium',
                    description: 'label for medium element in brightness state picker for araConnector extension'
                }),
                value: brightnessIndicator.MEDIUM
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.bright',
                    default: 'bright',
                    description: 'label for bright element in brightness state picker for araConnector extension'
                }),
                value: brightnessIndicator.BRIGHT
            },
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.brightest',
                    default: 'brightest',
                    description: 'label for brightest element in brightness state picker for araConnector extension'
                })
            }
        ]
    }

    /**
     * @return {array} - text and values for each temperature menu element
     */
    get COLOR_TEMP_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.cool',
                    default: 'cool',
                    description: 'label for cool element in temperature state picker for araConnector extension'
                }), 
                value: temperatureIndicator.COOL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.neutral',
                    default: 'neutral',
                    description: 'label for neutral element in temperature state picker for araConnector extension'
                }),
                value: temperatureIndicator.NEUTRAL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.warm',
                    default: 'warm',
                    description: 'label for warm element in temperature state picker for araConnector extension'
                }),
                value: temperatureIndicator.WARM
            }
        ]
    }

    /**
     * @return {array} - text and values for each light flash menu element
     */
    get FLASH_LIGHTS_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.5',
                    default: '5',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.10',
                    default: '10',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.20',
                    default: '20',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
        ];
    }

    /**
     * Construct a set of Ara blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._busy = false;

        // Create a new Ara peripheral instance
        this._peripheral = new AraConnector(this.runtime, Scratch3AraConnectorBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3AraConnectorBlocks.EXTENSION_ID,
            name: Scratch3AraConnectorBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'whenSwitchFlipped',
                    text: formatMessage({
                        id: 'araConnector.whenSwitchFlipped',
                        default: 'when light switched [BTN]',
                        description: 'when the light flip is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'whenBrightnessChanged',
                    text: formatMessage({
                        id: 'araConnector.whenBrightnessChanged',
                        default: 'when brigthness turns [BTN]',
                        description: 'when the light brightness is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'whenColorTemperatureChanged',
                    text: formatMessage({
                        id: 'araConnector.whenColorTemperatureChanged',
                        default: 'when temperature turns [BTN]',
                        description: 'when the light temperature is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
                '---',
                {
                    opcode: 'flipSwitch',
                    text: formatMessage({
                        id: 'araConnector.flipSwitch',
                        default: 'turn light [BTN]',
                        description: 'set the Ara light to on or off'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setLightBrightness',
                    text: formatMessage({
                        id: 'araConnector.setLightBrightness',
                        default: 'set brightness to [BTN]',
                        description: 'set the brightness of the Ara lamp'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'setColorTemperature',
                    text: formatMessage({
                        id: 'araConnector.setColorTemperature',
                        default: 'set temperature to [BTN]',
                        description: 'set the color temperature of the Ara lamp'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
                {
                    opcode: 'flashLights',
                    text: formatMessage({
                        id: 'araConnector.flashLights',
                        default: 'flash lights [BTN] times',
                        description: 'flash the light a number of times'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'flashLights',
                            defaultValue: '5'
                        }
                    }
                },
                '---',
                {
                    opcode: 'lightState',
                    text: formatMessage({
                        id: 'araConnector.lightState',
                        default: 'light is [BTN]',
                        description: 'whether the Ara light is on or off'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'brightnessState',
                    text: formatMessage({
                        id: 'araConnector.brightnessState',
                        default: 'brightness is [BTN]',
                        description: 'whether the Ara light is bright, neutral, or dull'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'temperatureState',
                    text: formatMessage({
                        id: 'araConnector.temperatureState',
                        default: 'temperature is [BTN]',
                        description: 'whether the Ara light is warm, neutral, or cool'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
            ],
            menus: {
                lightState: this.ON_OFF_MENU,
                brightness: this.BRIGHTNESS_MENU,
                flashLights: this.FLASH_LIGHTS_MENU,
                colorTemperature: this.COLOR_TEMP_MENU
            }
        };
    }

    /**
     * Test whether the switch is flipped
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenSwitchFlipped (args) {
        if (args.BTN == this._peripheral.lightState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test the light's brightness
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenBrightnessChanged (args) {
        if (args.BTN == this._peripheral.brightnessState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test the light's temperature
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenColorTemperatureChanged (args) {
        if (args.BTN == this._peripheral.temperatureState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    flipSwitch (args) {
        if (args.BTN == 'off') {
            // this._peripheral.setLightState('off');
            return this._peripheral.send(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_OFF);
        } else {
            // this._peripheral.setLightState('on');
            return this._peripheral.send(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_ON);
        }
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    setLightBrightness(args){
        if(args.BTN == 'bright') {
            // this._peripheral.setBrightnessState('bright');
            return this._peripheral.send(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_BRIGHT);
        }
            else if (args.BTN == 'brightest') {
                // this._peripheral.setBrightnessState('brightest');
                return this._peripheral.send(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_BRIGHTEST);
        } else if (args.BTN == 'medium') {
            // this._peripheral.setBrightnessState('medium');
            return this._peripheral.send(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_MEDIUM);
        } else if (args.BTN == 'dull') {
            // this._peripheral.setBrightnessState('dull');
            return this._peripheral.send(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_DULL);
        } 
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    setColorTemperature(args){
        if(args.BTN == 'cool') {
            this._peripheral.setTemperatureState('cool');
            return this._peripheral.send(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_COOL);
        } else if (args.BTN == 'neutral') {
            this._peripheral.setTemperatureState('neutral');
            return this._peripheral.send(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_NEUTRAL);
        } else {
            this._peripheral.setTemperatureState('warm');
            return this._peripheral.send(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_WARM);
        } 
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    flashLights (args) {
        var i;
        for (i = 0; i < parseInt(args.BTN); i++) {
            this._peripheral.send(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_OFF);
            this._peripheral.send(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_ON);
            this._peripheral.setLightState('on');
        }
    }

    /**
     * Test whether the on/off sensor is currently on or off.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the on/off sensor matches input.
     */
    lightState(args) {
        if (this._peripheral.lightState == args.BTN) {
            return true;
        } else {
            return false;
        }
        }

    /**
     * Test whether the brightness sensor is currently bright, medium or dull.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the brightness sensor matches input.
     */
    brightnessState(args) {
        if(this._peripheral.brightnessState == args.BTN) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test whether the temperature sensor is currently warm, neutral, or cool.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the temperature sensor matches input.
     */
    temperatureState(args) {
        if(this._peripheral.temperatureState == args.BTN) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Scratch3AraConnectorBlocks;
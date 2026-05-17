/**
 * Accessibility Modes Chrome Extension - Popup UI
 *
 * This React app serves as the popup interface for a Chrome extension
 * that provides three accessibility modes:
 * - Focus Mode: Reduces distractions
 * - Simple Mode: Simplifies content
 * - Calm Mode: Enhances readability
 *
 * In preview: Shows the extension popup interface
 * In Chrome: Becomes the actual extension popup when built
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { Slider } from "./components/ui/slider";
import { Focus, Sparkles, Heart, Settings, ArrowLeft } from "lucide-react";

interface ExtensionState {
  focusMode: boolean;
  simpleMode: boolean;
  calmMode: boolean;
}

export default function App() {
  const [state, setState] = useState<ExtensionState>({
    focusMode: false,
    simpleMode: false,
    calmMode: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [textScale, setTextScale] = useState(100);

  useEffect(() => {
    // Load saved state from chrome storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["focusMode", "simpleMode", "calmMode", "textScale", "textSize"], (result) => {
        setState({
          focusMode: result.focusMode || false,
          simpleMode: result.simpleMode || false,
          calmMode: result.calmMode || false,
        });

        if (typeof result.textScale === "number" && Number.isFinite(result.textScale)) {
          const clamped = Math.min(150, Math.max(100, Math.round(result.textScale)));
          setTextScale(clamped);
        } else {
          // Backward compatibility for existing 3-size setting.
          if (result.textSize === "large") {
            setTextScale(113);
          } else if (result.textSize === "huge") {
            setTextScale(125);
          } else {
            setTextScale(100);
          }
        }
      });
    }
  }, []);

  const toggleMode = (mode: keyof ExtensionState) => {
    const newState = { ...state, [mode]: !state[mode] };
    setState(newState);

    // Save to chrome storage and notify content script
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ [mode]: newState[mode] });

      // Send message to active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "TOGGLE_MODE",
            mode,
            enabled: newState[mode],
          });
        }
      });
    }
  };

  const setPageTextScale = (nextScale: number) => {
    const clamped = Math.min(150, Math.max(100, Math.round(nextScale)));
    setTextScale(clamped);

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ textScale: clamped });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "SET_TEXT_SCALE",
            scale: clamped,
          });
        }
      });
    }
  };

  return (
    <div className="w-[360px] min-h-[400px] bg-background p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{showSettings ? "Settings" : "Accessibility Modes"}</CardTitle>
              <CardDescription>
                {showSettings
                  ? "Adjust your reading preferences"
                  : "Enable modes to enhance your browsing experience"}
              </CardDescription>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted"
              aria-label={showSettings ? "Back to modes" : "Open settings"}
            >
              {showSettings ? <ArrowLeft className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
            </button>
          </div>
        </CardHeader>
        <CardContent className={showSettings ? "space-y-3" : "space-y-6"}>
          {showSettings ? (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Text Size</Label>
              <div className="space-y-2">
                <Slider
                  min={100}
                  max={150}
                  step={1}
                  value={[textScale]}
                  onValueChange={(values) => setPageTextScale(values[0] ?? 100)}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>100%</span>
                  <span className="font-medium text-foreground">{textScale}%</span>
                  <span>150%</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Focus className="w-4 h-4 text-blue-500" />
                    <Label htmlFor="focus-mode" className="cursor-pointer">
                      Focus Mode
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hides images/videos, highlights and bolds beginning words
                  </p>
                </div>
                <Switch
                  id="focus-mode"
                  checked={state.focusMode}
                  onCheckedChange={() => toggleMode("focusMode")}
                />
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <Label htmlFor="simple-mode" className="cursor-pointer">
                      Simple Mode
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Atkinson font, hover jargon for definitions
                  </p>
                </div>
                <Switch
                  id="simple-mode"
                  checked={state.simpleMode}
                  onCheckedChange={() => toggleMode("simpleMode")}
                />
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <Label htmlFor="calm-mode" className="cursor-pointer">
                      Calm Mode
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Low-stimulation theme with enhanced readability
                  </p>
                </div>
                <Switch
                  id="calm-mode"
                  checked={state.calmMode}
                  onCheckedChange={() => toggleMode("calmMode")}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

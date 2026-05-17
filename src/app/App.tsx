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
import { Focus, Sparkles, Heart } from "lucide-react";

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

  useEffect(() => {
    // Load saved state from chrome storage
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["focusMode", "simpleMode", "calmMode"], (result) => {
        setState({
          focusMode: result.focusMode || false,
          simpleMode: result.simpleMode || false,
          calmMode: result.calmMode || false,
        });
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

  return (
    <div className="w-[360px] min-h-[400px] bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Modes</CardTitle>
          <CardDescription>
            Enable modes to enhance your browsing experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
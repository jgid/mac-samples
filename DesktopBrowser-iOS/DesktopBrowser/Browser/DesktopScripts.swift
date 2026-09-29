import Foundation
import WebKit

/// JavaScript injected into every frame to make pages behave like on a desktop.
enum DesktopScripts {
    /// Name of the hidden function that updates the spoofed screen size in place,
    /// so a resolution change does not require a reload.
    static let updateFunctionName = "__desktopEmulatorUpdate"

    static func userScripts(screenSize: Resolution, profile: UserAgentProfile, spoofsEnvironment: Bool) -> [WKUserScript] {
        var scripts = [
            WKUserScript(source: viewportSource, injectionTime: .atDocumentStart, forMainFrameOnly: true),
        ]
        if spoofsEnvironment {
            scripts.append(WKUserScript(
                source: environmentSource(screenSize: screenSize, profile: profile),
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            ))
        }
        return scripts
    }

    static func updateCall(screenSize: Resolution) -> String {
        "window.\(updateFunctionName) && window.\(updateFunctionName)(\(screenSize.width), \(screenSize.height));"
    }

    /// Forces the layout viewport to the web view's width (the virtual screen width).
    ///
    /// Desktop browsers ignore `<meta name="viewport">`. Mobile WebKit honours it and
    /// lays out pages without one at 980 px, so we replace any page-provided viewport
    /// with `width=device-width`, where device-width is the size of our enlarged web view.
    private static let viewportSource = """
    (function () {
      var CONTENT = 'width=device-width, initial-scale=1';
      function isViewport(node) {
        return node && node.nodeName === 'META' && (node.getAttribute('name') || '').toLowerCase() === 'viewport';
      }
      function neutralize(meta) {
        if (meta.getAttribute('content') !== CONTENT) meta.setAttribute('content', CONTENT);
      }
      var own = document.createElement('meta');
      own.setAttribute('name', 'viewport');
      own.setAttribute('content', CONTENT);
      (document.head || document.documentElement).appendChild(own);

      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.type === 'attributes') {
            if (isViewport(m.target)) neutralize(m.target);
            return;
          }
          m.addedNodes.forEach(function (node) {
            if (isViewport(node)) neutralize(node);
            if (node.querySelectorAll) node.querySelectorAll('meta[name=viewport]').forEach(neutralize);
          });
        });
      }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['content', 'name'] });
    })();
    """

    private static func environmentSource(screenSize: Resolution, profile: UserAgentProfile) -> String {
        """
        (function () {
          var cfg = { width: \(screenSize.width), height: \(screenSize.height) };
          var platform = \(jsString(profile.platform));
          var vendor = \(jsString(profile.vendor));

          function def(obj, prop, getter) {
            try { Object.defineProperty(obj, prop, { get: getter, configurable: true }); } catch (e) {}
          }

          def(Screen.prototype, 'width', function () { return cfg.width; });
          def(Screen.prototype, 'height', function () { return cfg.height; });
          def(Screen.prototype, 'availWidth', function () { return cfg.width; });
          def(Screen.prototype, 'availHeight', function () { return cfg.height; });
          def(window, 'outerWidth', function () { return cfg.width; });
          def(window, 'outerHeight', function () { return cfg.height; });

          def(Navigator.prototype, 'platform', function () { return platform; });
          def(Navigator.prototype, 'vendor', function () { return vendor; });
          def(Navigator.prototype, 'maxTouchPoints', function () { return 0; });

          // Hide touch support from feature detection ('ontouchstart' in window).
          // Real touch events keep firing for listeners registered via addEventListener.
          ['ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'].forEach(function (name) {
            [window, Window.prototype, Document.prototype, Element.prototype, HTMLElement.prototype].forEach(function (target) {
              try { delete target[name]; } catch (e) {}
            });
          });

          // Answer hover/pointer media queries like a device with a mouse.
          var TRUE_QUERY = '(min-width: 0px)';
          var FALSE_QUERY = '(max-width: 0px) and (min-width: 1px)';
          var rules = [
            [/\\(\\s*(any-)?pointer\\s*:\\s*fine\\s*\\)/gi, TRUE_QUERY],
            [/\\(\\s*(any-)?pointer\\s*:\\s*(coarse|none)\\s*\\)/gi, FALSE_QUERY],
            [/\\(\\s*(any-)?hover\\s*:\\s*hover\\s*\\)/gi, TRUE_QUERY],
            [/\\(\\s*(any-)?hover\\s*:\\s*none\\s*\\)/gi, FALSE_QUERY]
          ];
          var originalMatchMedia = window.matchMedia;
          if (originalMatchMedia) {
            window.matchMedia = function (query) {
              var rewritten = String(query);
              rules.forEach(function (rule) { rewritten = rewritten.replace(rule[0], rule[1]); });
              return originalMatchMedia.call(window, rewritten);
            };
          }

          Object.defineProperty(window, \(jsString(updateFunctionName)), {
            value: function (w, h) { cfg.width = w; cfg.height = h; },
            enumerable: false
          });
        })();
        """
    }

    private static func jsString(_ value: String) -> String {
        guard let data = try? JSONEncoder().encode(value), let encoded = String(data: data, encoding: .utf8) else {
            return "\"\""
        }
        return encoded
    }
}

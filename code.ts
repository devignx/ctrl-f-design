// Buddee - Modern Chatbot UI for Figma Design Links
// This plugin provides a chatbot interface to search and interact with Figma design links

interface UserMessage {
  type: 'user-message';
  text: string;
}

interface PreviewActionMessage {
  type: 'preview-action';
  action: 'copy' | 'insert' | 'goto';
  url: string;
  title: string;
}

type PluginMessage = UserMessage | PreviewActionMessage;

// Show the UI with appropriate size for chatbot
figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true
});

// Handle messages from the UI
figma.ui.onmessage = (msg: PluginMessage) => {
  if (msg.type === 'user-message') {
    // User sent a message - the UI handles the response with mock data
    // In a real implementation, you would call an API here to fetch actual links
    console.log('User message:', msg.text);
    
    // Example: You could call an API here
    // const response = await fetch('https://api.example.com/search?q=' + msg.text);
    // const links = await response.json();
    // figma.ui.postMessage({ type: 'links-found', links: links });
  }

  if (msg.type === 'preview-action') {
    const { action, url, title } = msg;
    
    switch (action) {
      case 'copy':
        handleCopyLayer(url, title);
        break;
      case 'insert':
        handleInsertDesign(url, title);
        break;
      case 'goto':
        handleGoToFile(url, title);
        break;
    }
  }
};

// Copy the Figma layer to clipboard
async function handleCopyLayer(url: string, title: string): Promise<void> {
  try {
    // Get selected nodes
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a layer to copy first');
      return;
    }

    // In Figma, copying is done via the native clipboard
    // We'll simulate this by duplicating the selected nodes
    // In a real implementation, you would:
    // 1. Fetch the design from the URL
    // 2. Parse the Figma file structure
    // 3. Create a duplicate of the specific layer/node
    
    // For MVP, we'll just notify and let the user know they can use Cmd+C
    figma.notify(`✓ Ready to copy: ${title}. Use Cmd+C (Mac) or Ctrl+C (Windows) to copy selected layers.`);
    
    // Alternatively, duplicate the selection
    const duplicates: SceneNode[] = [];
    for (const node of selection) {
      const duplicate = node.clone();
      duplicate.x += 20;
      duplicate.y += 20;
      figma.currentPage.appendChild(duplicate);
      duplicates.push(duplicate);
    }
    figma.currentPage.selection = duplicates;
    figma.viewport.scrollAndZoomIntoView(duplicates);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    figma.notify(`Error copying layer: ${errorMessage}`);
  }
}

// Insert the design into the current page
async function handleInsertDesign(url: string, title: string): Promise<void> {
  try {
    // For MVP, create a placeholder frame representing the design
    const frame = figma.createFrame();
    frame.name = title;
    frame.resize(400, 300);
    
    // Position it in the center of the viewport
    const viewportCenter = {
      x: figma.viewport.center.x - 200,
      y: figma.viewport.center.y - 150
    };
    frame.x = viewportCenter.x;
    frame.y = viewportCenter.y;
    
    // Add a gradient background to make it look like a design preview
    frame.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientStops: [
        { position: 0, color: { r: 0.4, g: 0.49, b: 0.92, a: 1 } },
        { position: 1, color: { r: 0.46, b: 0.29, g: 0.64, a: 1 } }
      ],
      gradientTransform: [[0, 1, 0], [1, 0, 0]]
    }];
    
    // Add a text label
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    text.characters = title;
    text.fontSize = 16;
    text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    text.x = 20;
    text.y = 20;
    frame.appendChild(text);
    
    // Add to current page
    figma.currentPage.appendChild(frame);
    
    // Select and zoom to the new frame
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    
    figma.notify(`✓ Inserted design: ${title}`);
    
    // In a real implementation, you would:
    // 1. Fetch the Figma file from the URL
    // 2. Parse the file structure
    // 3. Import the actual design nodes
    // 4. Insert them into the current page
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    figma.notify(`Error inserting design: ${errorMessage}`);
  }
}

// Navigate to the Figma file
async function handleGoToFile(url: string, title: string): Promise<void> {
  try {
    // Open the URL in the browser
    figma.openExternal(url);
    figma.notify(`Opening: ${title}`);
    
    // Note: Figma plugin API doesn't support directly navigating to files
    // This opens the URL in the default browser
    // In a real implementation, you might want to:
    // 1. Parse the Figma file ID from the URL
    // 2. Use Figma API to get file details
    // 3. Provide instructions or deep link to the file
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    figma.notify(`Error opening file: ${errorMessage}`);
  }
}

import plotly.graph_objects as go
import pandas as pd

# Process the asset data into a proper grid layout
categories = [
    {"name": "Brand Identity", "assets": [
        {"file": "Logo.jpg", "description": "Main logo", "usage": "Headers"},
        {"file": "favicon.png", "description": "Browser icon", "usage": "Favicon"},
        {"file": "app_icon.png", "description": "Mobile icon", "usage": "Apps"}
    ]},
    {"name": "Website Headers", "assets": [
        {"file": "header.png", "description": "Header banner", "usage": "Website"},
        {"file": "hero.png", "description": "Portal hero", "usage": "Landing"},
        {"file": "contact.png", "description": "Contact bg", "usage": "Contact"}
    ]},
    {"name": "Functional Icons", "assets": [
        {"file": "security.png", "description": "Security icon", "usage": "Security"},
        {"file": "rights.png", "description": "Rights icon", "usage": "Civil rights"},
        {"file": "loading.png", "description": "Loading icon", "usage": "Loading"}
    ]},
    {"name": "Section Graphics", "assets": [
        {"file": "team.png", "description": "Team image", "usage": "About"},
        {"file": "404.png", "description": "404 graphic", "usage": "Error pages"}
    ]}
]

# Create figure
fig = go.Figure()

# Define layout parameters
y_start = 4
row_height = 1.5
asset_spacing = 1.5
asset_width = 1.2
asset_height = 0.8

# Colors for different asset types (grayscale for professional look)
asset_colors = {
    "Brand Identity": "#D3D3D3",
    "Website Headers": "#B8B8B8", 
    "Functional Icons": "#A0A0A0",
    "Section Graphics": "#888888"
}

data = []
shapes = []
annotations = []

for cat_idx, category in enumerate(categories):
    y_pos = y_start - (cat_idx * row_height)
    
    # Add category background box
    max_assets = max(len(cat["assets"]) for cat in categories)
    shapes.append(dict(
        type="rect",
        x0=-0.8,
        y0=y_pos - asset_height/2 - 0.1,
        x1=(max_assets - 1) * asset_spacing + asset_width/2 + 0.2,
        y1=y_pos + asset_height/2 + 0.1,
        fillcolor="rgba(240,240,240,0.3)",
        line=dict(color="black", width=1)
    ))
    
    # Add category label
    annotations.append(dict(
        x=-0.6,
        y=y_pos,
        text=f"<b>{category['name'][:15]}</b>",
        showarrow=False,
        xanchor="right",
        yanchor="middle",
        font=dict(size=11, color="black")
    ))
    
    # Add each asset
    for asset_idx, asset in enumerate(category["assets"]):
        x_pos = asset_idx * asset_spacing
        
        # Create asset thumbnail box
        shapes.append(dict(
            type="rect",
            x0=x_pos - asset_width/2,
            y0=y_pos - asset_height/2,
            x1=x_pos + asset_width/2,
            y1=y_pos + asset_height/2,
            fillcolor=asset_colors[category["name"]],
            line=dict(color="black", width=2)
        ))
        
        # Add file name (top of box)
        annotations.append(dict(
            x=x_pos,
            y=y_pos + 0.2,
            text=f"<b>{asset['file'][:15]}</b>",
            showarrow=False,
            xanchor="center",
            yanchor="middle",
            font=dict(size=9, color="black")
        ))
        
        # Add description (middle of box)
        annotations.append(dict(
            x=x_pos,
            y=y_pos,
            text=asset['description'][:15],
            showarrow=False,
            xanchor="center",
            yanchor="middle",
            font=dict(size=8, color="black")
        ))
        
        # Add usage (bottom of box)
        annotations.append(dict(
            x=x_pos,
            y=y_pos - 0.2,
            text=asset['usage'][:15],
            showarrow=False,
            xanchor="center",
            yanchor="middle",
            font=dict(size=7, color="gray")
        ))
        
        # Add hover data point
        hover_text = f"<b>File:</b> {asset['file']}<br><b>Type:</b> {asset['description']}<br><b>Usage:</b> {asset['usage']}"
        data.append({
            'x': x_pos,
            'y': y_pos,
            'hover': hover_text,
            'category': category["name"]
        })

df = pd.DataFrame(data)

# Add invisible scatter for hover
fig.add_trace(go.Scatter(
    x=df['x'],
    y=df['y'],
    mode='markers',
    marker=dict(
        size=100,
        color='rgba(0,0,0,0)',  # Transparent
        line=dict(color='rgba(0,0,0,0)', width=0)
    ),
    hovertemplate='%{hovertext}<extra></extra>',
    hovertext=df['hover'],
    showlegend=False
))

# Update layout
fig.update_layout(
    title="MIS Alliance Assets",
    shapes=shapes,
    annotations=annotations,
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-1, 4]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[0.5, 5]
    ),
    plot_bgcolor='white',
    paper_bgcolor='white'
)

fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image("asset_grid.png")
fig.write_image("asset_grid.svg", format="svg")
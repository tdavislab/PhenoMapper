# PhenoMapper

PhenoMapper is an extension of [Mapper Interactive](https://github.com/MapperInteractive/MapperInteractive), which is a web-based framework for interactive analysis and visualization of high-dimensional point cloud data built upon the mapper algorithm.

## Installation

```bash
git clone git@github.com:tdavislab/PhenoMapper.git
cd PhenoMapper
python3 run.py
```

After running the above commands, you can run Mapper Interactive by visiting http://127.0.0.1:8000/ on the local machine (If possible, please use Chrome).

## Dependencies
This software requires [Kepler Mapper](https://kepler-mapper.scikit-tda.org/), [scikit-learn](https://scikit-learn.org/stable/), [NetworkX](https://networkx.github.io/) and [flask](https://flask.palletsprojects.com/en/1.1.x/) to run.

If you do not have these packages installed, please use the following command to intall them.

```bash
pip install scikit-learn
pip install networkx
pip install flask
pip install flask_assets
```

To perform linear regression, please also make sure you have [statsmodels](https://www.statsmodels.org/stable/index.html) installed.
```bash
pip install statsmodels
```

## Interface
![Screenshot of interface](app/static/assets/interface.png)

<!-- ## Loading a dataset
When loading a dataset into the interface, please make sure to put the data file to be loaded in the folder ``app/static/uploads/``. -->

## Command-line API
Please refer to a user-guide [here](CLI_README.md) for the command-line API.

<!-- ## Video

[![Screenshot of video](app/static/assets/video-teaser.png)](https://www.youtube.com/watch?v=z2VEkv1apF8) -->

<!-- ## License

This project is licensed under the MIT License - see the `LICENSE` file for details. -->

## Data Format

### Importing raw data

To compute a mapper graph, point cloud data can be input in CSV format.

The following is an example of an input CSV file.

```bash
x,y,z
0.013,0.275,0.465
0.216,0.981,-0.424
0.804,-0.424,0.217
...
```

### Importing a pre-computed mapper graph
Using the command-line API, users can compute mapper graphs offline. 

The outputting mapper graph will be saved in JSON format, which can be loaded in the GUI.

The following is an example of a mapper graph file.

```bash
{
    "nodes":{
        "cube0_cluster0": [19, 21, 66],
        ...
    },
    "edges":{
        "cube0_cluster0": ["cube1_cluster0"],
        ...
    }
}
```

## Contributing

Pull requests are welcomed. 

## Cite

Pheno-Mapper: An Interactive Toolbox for the Visual Exploration of Phenomics Data.
Youjia Zhou, Methun Kamruzzaman, Patrick Schnable, Bala Krishnamoorthy, Ananth Kalyanaraman, Bei Wang.\
Submitted to ACM-BCB, 2021.

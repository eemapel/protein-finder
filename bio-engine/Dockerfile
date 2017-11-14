from python:2

WORKDIR /usr/src/engine

# Copy needed files
COPY *.py ./

RUN pip install \
  biopython \
  flask \
  requests

EXPOSE 7000
CMD [ "python", "rest.py" ]


import random, re
from Bio import Entrez

Entrez.email = "noreply@noreply.na"

class Protein:
    dictionary = {}

    def __init__(self, nc_codes):
        codes = nc_codes.split(",")

        for key in codes:
            handle = Entrez.esearch(db="nucleotide", term=key + "[Locus]")
            record = Entrez.read(handle)
            if len(record['IdList']) != 1:
                raise Exception("Incorrect amount of record IDs")

            # For some reason json does not work
            handle=Entrez.efetch(db="nucleotide", id=record['IdList'][0], rettype="fasta", retmode="xml")
            record = handle.read()

            # Parse XML to get the name
            m = re.search("<TSeq_orgname>(.*)?</TSeq_orgname>", record)
            if m is None:
                raise Exception('Parsing error getting orgname with ' + record)

            # Create record
            self.dictionary[key] = {}
            self.dictionary[key]["name"] =  m.group(1)

            # Parse XML to get the sequence
            #
            # Note: Besides of typical AGCT, Nucleotide ambiguity codes that
            #       use other letters may be present.
            #
            m = re.search("<TSeq_sequence>([A-Y]+)</TSeq_sequence>", record)
            if m is None:
                raise Exception('Parsing error getting sequence with ' + record)
            self.dictionary[key]["sequence"] = m.group(1)

    # Return True if sequence alignment found
    def check_sequence_alignment(self, code, sequence):
        # Finding exact sequence doesn't seem any simpler with biopython
        return sequence in self.dictionary[code]["sequence"]

    # Return array of all loaded protein codes in random order
    def get_code_list(self):
        arr = []
        [ arr.append(key) for key in self.dictionary ]
        random.shuffle(arr)
        return arr

    # Return name of protein matching the code
    def get_name(self, code):
        return self.dictionary[code]["name"]

    def print_names(self):
        for key in self.dictionary:
            print self.dictionary[key]["name"]


"""Shared helpers for Unit 2 question generators."""
import os, json

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(name):
    p = os.path.join(BASE, name)
    if os.path.exists(p):
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    return []


def save(name, data):
    with open(os.path.join(BASE, name), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def ao_for(marks):
    if marks <= 2:
        return 'AO1'
    if marks <= 4:
        return 'AO2'
    return 'AO3'


def qtype_for(marks):
    if marks >= 6:
        return 'short'   # app uses marks>=6 for 'long' styling via styleOfQuestion, keep type short
    return 'short'


def make_q(qid, aim, topic, verb, marks, scenario, question, points, type_='short',
           additional='', figure=None, mermaid=None, options=None, answer=None, explanation=None,
           instruction=None):
    scheme = {'instruction': instruction or f'Award up to {marks} marks.', 'points': points}
    if additional:
        scheme['additional_guidance'] = additional
    out = {
        'id': qid, 'learning_aim': aim, 'topic': topic,
        'command_verb': verb, 'marks': marks, 'ao': ao_for(marks),
        'scenario': scenario, 'question': question,
        'guidance': f'({marks})', 'type': type_,
        'mark_scheme': scheme,
    }
    if figure:
        out['figure'] = figure
        out['type'] = 'diagram'
        out['diagram_kind'] = 'diagram'
    if mermaid:
        out['mermaid'] = mermaid
    if type_ == 'multiple_choice':
        out['options'] = options
        out['mark_scheme']['answer'] = answer
        if explanation:
            out['mark_scheme']['explanation'] = explanation
    elif mermaid:
        out['type'] = 'diagram'
        out['diagram_kind'] = 'diagram'
    return out